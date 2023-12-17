import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessagerDto } from './dto/create-message.dto';
import { DB_DEVICE_DATA, DB_MESSAGE, DB_NOTIFICATION, DB_ROOM, DB_USER } from '../repository/db-collection';
import { MessageDocument } from './entities/message.entity';
import { UserDocument } from '../user/entities/user.entity';
import { FetchQueryOption } from 'src/common/pipe/fetch-query-option.interface';
import { ChatPageableDto } from './dto/chat-pageable.dto';
import { PageableDto } from 'src/common/dto/pageable.dto';
import { RoomDocument } from '../socketio/entities/room.entity';
import { CreateNotificationDTO } from '../notifications/dto/create-notification.dto';
import { OneSignalService } from 'src/config/one-signal';
import { DeviceDataDocument } from '../device-data/device-data.schema';
@Injectable()
export class ChatService {
  constructor(
    @InjectModel(DB_MESSAGE)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(DB_USER)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(DB_ROOM)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(DB_DEVICE_DATA)
    private readonly deviceDataModel: Model<DeviceDataDocument>,
  ) { }

  async createMessage(createMessageDto: CreateMessagerDto) {
    const sender = await this.userModel.findById(createMessageDto.senderId)
    const deviceData = await this.deviceDataModel.find({userId: createMessageDto.receiverId})
    const room = await this.roomModel.findById(createMessageDto.roomId)
    const listOneSignalId = deviceData.map(e => e.oneSignalId)
    OneSignalService.sendPeople(
      `Bạn vừa nhận được tin nhắn mới từ ${sender?.hoTen}`,
      listOneSignalId,
      {
        data: {
          type: "mess",
          receiverId: createMessageDto.senderId,
          roomCode: room.roomCode,
          roomName: sender.hoTen
        }
      }
    )
        .then(async (oneSignalNotiId) => {
            console.log("oneSignalNotiId: ", oneSignalNotiId);
        })
        .catch((err) => {
            console.error(err);
        });
    return await this.messageModel.create(createMessageDto)
  }

  async findPageable(
    cond: any,
    option: FetchQueryOption,
    user: UserDocument
  ): Promise<ChatPageableDto> {
    Object.assign(cond, {
      "$or": [
        {
          "senderId": user._id
        },
        {
          "receiverId": user._id
        }
      ]
    })
    const total = this.messageModel.countDocuments(cond);
    const result = await this.messageModel
      .find(cond)
      .setOptions(option)
      .populate("roomId")
      .populate("receiverId")
      .populate("senderId")
    return Promise.all([total, result]).then((p) => PageableDto.create(option, p[0], p[1]));
  }

  async findPageableRoom(
    cond: any,
    option: FetchQueryOption,
    user: UserDocument
  ): Promise<ChatPageableDto> {
    Object.assign(cond, { danhSachUser: { $elemMatch: { $eq: user._id } } })
    const total = this.roomModel.countDocuments(cond);
    const result = this.roomModel
      .find(cond)
      .setOptions(option)
      .populate("danhSachUser")
    return Promise.all([total, result]).then((p) => PageableDto.create(option, p[0], p[1]));
  }

  async findMyMessage(cond: any, user: UserDocument) {
    return await this.messageModel.find(cond).sort({ updatedAt: -1 })
  }

  async verifyMessage(id: string, createMessageDto: CreateMessagerDto, user: UserDocument) {
    const mess = await this.messageModel.findById(id)
    if(!!mess && mess?.receiverId?.includes(user._id)) {
      const result = await this.messageModel.findByIdAndUpdate(id, {content: createMessageDto.content, signed: true, seen: true}, {new: true})
      return result
    }

    return mess
  }

}