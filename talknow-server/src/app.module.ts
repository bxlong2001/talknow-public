import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb-config.service';
import { OtpModule } from './modules/otp/otp.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SocketGateway } from './modules/socketio/socket.gateway';
import { SocketModule } from './modules/socketio/socket.module';
import { ChatModule } from './modules/chat/chat.module';
import { DHModule } from './modules/dh-algorithm/dh.module';
import { DeviceDataModule } from "./modules/device-data/device-data.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      inject: [ConfigService]
    }),
    RepositoryModule,
    AuthModule,
    OtpModule,
    UserModule,
    SocketModule,
    ChatModule,
    DHModule,
    DeviceDataModule
  ],
})
export class AppModule {}
