import { DB_OTP } from 'src/modules/repository/db-collection';
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as db from "./db-collection";
import { OtpSchema } from '../otp/entities/otp.entity';
import { UserSchema } from '../user/entities/user.entity';
import { RoomSchema } from '../socketio/entities/room.entity';
import { MessageSchema } from '../chat/entities/message.entity';
import { DHSchema } from '../dh-algorithm/entities/dh.entity';
import { FriendRequestSchema } from '../user/entities/friend-request.entity';
import { DeviceDataSchema } from '../device-data/device-data.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: db.DB_OTP, schema: OtpSchema },
            { name: db.DB_ROOM, schema: RoomSchema },
            { name: db.DB_MESSAGE, schema: MessageSchema },
            { name: db.DB_DH, schema: DHSchema },
            { name: db.DB_USER, schema: UserSchema },
            { name: db.DB_FRIEND_REQUEST, schema: FriendRequestSchema },
            { name: db.DB_DEVICE_DATA, schema: DeviceDataSchema },
        ])
    ],
    providers: [],
    exports: [MongooseModule]
})
export class RepositoryModule { }
