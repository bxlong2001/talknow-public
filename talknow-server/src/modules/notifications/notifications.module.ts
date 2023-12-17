// import { Global, Module } from "@nestjs/common";
// import { MongooseModule } from "@nestjs/mongoose";
// import { DB_NOTIFICATION, DB_USER } from "../repository/db-collection";
// import { NotificationsController } from "./notifications.controller";
// import { NotificationsService } from "./notifications.service";
// import { UserSchema } from "../user/entities/user.entity";
// import { NotificationSchema } from "./entities/notifications.entity";

// @Global()
// @Module({
//     imports: [
//         MongooseModule.forFeature([
//             { name: DB_NOTIFICATION, schema: NotificationSchema },
//             // { name: DB_USER_NOTIFICATION, schema: UserNotificationSchema },
//             // { name: DEVICE_DATA_MODEL, schema: DeviceDataSchema },
//             { name: DB_USER, schema: UserSchema },
//         ]),
//         // DeviceDataModule,
//     ],
//     controllers: [NotificationsController],
//     providers: [NotificationsService],
//     exports: [NotificationsService],
// })
// export class NotificationsModule {}
