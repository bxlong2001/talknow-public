import { InjectModel } from '@nestjs/mongoose';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { UserDocument } from '../user/entities/user.entity';
import { DB_ROOM, DB_USER } from '../repository/db-collection';
import { RoomDocument } from './entities/room.entity';
import { AccessibleModel } from '@casl/mongoose';
import { ChatService } from '../chat/chat.service';
import { Message } from '../chat/entities/message.entity';
import * as moment from "moment";

@WebSocketGateway(3000, { transports: ['websocket'] })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(DB_ROOM) 
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(DB_USER)
    private readonly userModel: AccessibleModel<UserDocument>,
    
    private readonly chatService: ChatService,
  ) {}
  
  private rooms: Map<string, Set<Socket>> = new Map();
  private async updateUserOnlineStatus(userId: string, isOnline: boolean, lastOnlineAt?: Date): Promise<void> {
    if(!!lastOnlineAt) {
      await this.userModel.findByIdAndUpdate(userId, { isOnline, lastOnlineAt });
    }else {
      await this.userModel.findByIdAndUpdate(userId, { isOnline });
    }
  }

  private async getOnlineUsers(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    return await this.userModel.find({_id: {$in: user.friendsId}})
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    this.updateUserOnlineStatus(userId, true);
    // Assume you have a function to get online users
    const onlineUsers = this.getOnlineUsers(userId);
    
    // Send the list of online users to all clients
    this.server.emit('onlineUsers', onlineUsers);
    console.log("userId current: ", userId);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    this.updateUserOnlineStatus(userId, false, new Date());
    console.log("userId current: ", userId);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, roomInfo: any) {
    this.leaveRoom(client);
    const {roomCode, listUser} = roomInfo
    let room = await this.roomModel.findOne({ roomCode }).exec();

    if (!room) {
      room = new this.roomModel({...roomInfo, danhSachUser: listUser});
      await room.save();
    }

    const roomSet = this.rooms.get(roomCode) || new Set();
    roomSet.add(client);

    client.join(roomCode);
    client.emit('room', {roomId: room._id});
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(client: Socket, payload: any) {
    console.log("payload: ", payload);
    const message = {
      content: payload?.message[0]?.text,
      roomId: payload?.roomId,
      thoiGianGui: moment().toDate(),
      receiverId: payload?.receiverId,
      senderId: payload?.senderId,
      type: payload?.type
    } as Message
    const room = await this.roomModel.findById(payload?.roomId)
    const clientsInRoom = await this.server.in(room.roomCode).allSockets();
    console.log("clientsInRoom: ", clientsInRoom);
    const newMessage = await this.chatService.createMessage(message)
    client.to(room.roomCode).emit('chatMessage', { newMessage, type: payload.type });
  }

  private leaveRoom(client: Socket) {
    const roomCode = this.findRoomByClient(client);
    if (roomCode) {
      const room = this.rooms.get(roomCode);
      room.delete(client);

      if (room.size === 0) {
        this.rooms.delete(roomCode);
      }

      client.leave(roomCode);
    }
  }

  private findRoomByClient(client: Socket): string | undefined {
    for (const [roomCode, room] of this.rooms) {
      if (room.has(client)) {
        return roomCode;
      }
    }
    return undefined;
  }
}
