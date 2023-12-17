import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { UserDocument } from '../entities/user.entity';
import { DB_DEVICE_DATA, DB_FRIEND_REQUEST, DB_OTP, DB_USER } from 'src/modules/repository/db-collection';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { OtpDocument } from 'src/modules/otp/entities/otp.entity';
import { ErrorData } from 'src/common/exception/error-data';
import { AccessibleModel } from '@casl/mongoose';
import { UserPageableDto } from '../dto/user-pageable.dto';
import { FetchQueryOption } from 'src/common/pipe/fetch-query-option.interface';
import { PageableDto } from 'src/common/dto/pageable.dto';
import { UserAuthorizedDocument } from '../dto/user-authorized.dto';
import { EFriendRequest, UserErrorCode } from '../common/user.constant';
import { ChangePasswordDto } from '../dto/response/change-password.dto';
import { LoginResultDto } from 'src/modules/auth/dto/login-result.dto';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload';
import { FriendRequestDocument } from '../entities/friend-request.entity';
import { DeviceDataDocument } from 'src/modules/device-data/device-data.schema';
import { OneSignalService } from 'src/config/one-signal';
import { CreateNotificationDTO } from 'src/modules/notifications/dto/create-notification.dto';

@Injectable()
export class UserService {
  constructor (
    @InjectModel(DB_USER)
    private readonly userModel: AccessibleModel<UserDocument>,
    @InjectModel(DB_OTP)
    private readonly otpModel: Model<OtpDocument>,
    @InjectModel(DB_FRIEND_REQUEST)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
    @InjectModel(DB_DEVICE_DATA)
    private readonly deviceDataModel: Model<DeviceDataDocument>
  ) {}
  
  async createUser(createUserDto: CreateUserDto) {
    const checkOtp = await this.otpModel.findOne({
      soDienThoai: createUserDto.soDienThoai,
      isConfirmSms: true,
    })

    if(!checkOtp) {
      throw ErrorData.BadRequest("Số điện thoại chưa được xác thực")
    }

    const user = await this.userModel.create(createUserDto)
    return user
  }

  async findPageable ( conditions: any, option: FetchQueryOption, user: UserDocument ): Promise<UserPageableDto> {
    const total = this.userModel.countDocuments(conditions);
    const result = this.userModel
        .find( conditions )
        .setOptions( option )
        .select("-password");
    return Promise.all( [ total, result ] ).then( ( p ) => PageableDto.create( option, p[ 0 ], p[ 1 ] ) );
  }

  async findProfileByJWT(user: UserDocument) {
    const profile = await this.userModel.findById(user._id).select("-password");
    
    return profile;
  }

  async changePassword(user: UserAuthorizedDocument, changePassword: ChangePasswordDto) {
    const currentUser = await this.userModel.findById(user._id)
    const correctOldPassword = await currentUser.comparePassword(changePassword.oldPassword);
    if (!correctOldPassword) {
        throw ErrorData.BadRequest(UserErrorCode.BAD_REQUEST_WRONG_OLD_PASSWORD);
    }
    if (changePassword.newPassword === changePassword.oldPassword) {
        throw ErrorData.BadRequest(UserErrorCode.BAD_REQUEST_DUPLICATE_NEW_PASSWORD);
    }
    currentUser.password = changePassword.newPassword;
    await currentUser.save();
  }

  async addFriend(user: UserDocument, id: string, status: EFriendRequest) {
    if(status === EFriendRequest.REJECTED) {
      const friendRequest = await this.friendRequestModel.deleteOne({
        senderId: user._id,
        receiverId: id,
      })
      if(!friendRequest) {
        throw ErrorData.BadRequest("NOT_FOUND");
      }
    }else if (status === EFriendRequest.PENDING) {
      const sender = await this.userModel.findById(user._id)
      const deviceData = await this.deviceDataModel.find({userId: id})
      const listOneSignalId = deviceData.map(e => e.oneSignalId)
      await this.friendRequestModel.findOneAndUpdate({
        senderId: user._id,
        receiverId: id,
      }, {
        status
      }, {
        new: true,
        upsert: true
      })
      OneSignalService.sendPeople(
        `Bạn vừa nhận được lời mời kết bạn từ ${sender?.hoTen}`,
        listOneSignalId,
        {
          data: {
            type: "friend",
            status: "received"
          }
        }
      )
          .then(async (oneSignalNotiId) => {
              console.log("oneSignalNotiId: ", oneSignalNotiId);
          })
          .catch((err) => {
              console.error(err);
          });
    }else if (status === EFriendRequest.ACCEPTED) {
      const friendRequest = await this.friendRequestModel.findOneAndUpdate({
        senderId: id,
        receiverId: user._id,
      }, {
        status
      }, {
        new: true,
      })
      if(!friendRequest) {
        throw ErrorData.BadRequest("NOT_FOUND");
      }
      await this.acceptFriend(user, id)
      const sender = await this.userModel.findById(id)
      const receiver = await this.userModel.findById(user._id)
      const deviceData = await this.deviceDataModel.find({userId: id})
      const listOneSignalId = deviceData.map(e => e.oneSignalId)
      console.log("listOneSignalId: ", listOneSignalId);
      
      await this.friendRequestModel.findOneAndUpdate({
        senderId: user._id,
        receiverId: id,
      }, {
        status
      }, {
        new: true,
        upsert: true
      })
      OneSignalService.sendPeople(
        `Bạn vừa được ${receiver?.hoTen} chấp thuận lời mời kết bạn. Giờ đây hai bạn đã có thể trò chuyện với nhau.`,
        listOneSignalId,
        {
          data: {
            type: "friend"
          }
        }
      )
          .then(async (oneSignalNotiId) => {
              console.log("oneSignalNotiId: ", oneSignalNotiId);
          })
          .catch((err) => {
              console.error(err);
          });
    }
  }

  async acceptFriend(user: UserDocument, id: string) {
    await this.userModel.findByIdAndUpdate(id, {
      $push: {friendsId: user._id}
    }, { new: true })
    return await this.userModel.findByIdAndUpdate(user._id, {
      $push: {friendsId: id}
    }, { new: true })
  }

  async getFriendRequest(user: UserDocument, cond: any) {
    if(cond?.status === 'sent') {
      return await this.friendRequestModel.find({senderId: user._id, status: {$nin: [EFriendRequest.ACCEPTED]}}).populate("sender").populate("receiver")
    }else if (cond?.status === 'received') {
      return await this.friendRequestModel.find({receiverId: user._id, status: {$nin: [EFriendRequest.ACCEPTED]}}).populate("sender").populate("receiver")
    }
  }

  async forgotPassword(data: {sdt: string, password: string}) {
    const user = await this.userModel.findOne({soDienThoai: data.sdt})
    if (!user) {
      throw ErrorData.BadRequest("USER_NOT_FOUND");
    }
    user.password = data.password;
    await user.save();
    return user;
  }
}