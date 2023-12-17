import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatService } from '../chat/chat.service';

@Module({
  providers: [SocketGateway, ChatService],
})
export class SocketModule {}
