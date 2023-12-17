// import { Injectable, Logger } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import * as bluebird from "bluebird";
// import * as _ from "lodash";
// import { ObjectId } from "mongodb";
// import { Model } from "mongoose";
// import { OneSignalOption, OneSignalService } from "src/config/one-signal";
// import { UserDocument } from "../user/entities/user.entity";
// import { ELoaiLapLaiThongBao, ENotificationSentType, ENotificationStatus } from "./common/notifications.constants";
// import { CreateNotificationDTO } from "./dto/create-notification.dto";
// import { DEVICE_DATA_MODEL, DeviceDataDocument } from "../device-data/device-data.schema";
// import { DB_NOTIFICATION } from "./entities/notifications.entity";

// export interface UserRoleId {
//     userId: string;
//     roleId: string;
// }
// @Injectable()
// export class NotificationsService <NotificationDocument>{
//     private logger: Logger = new Logger("NotificationService");
//     constructor(
//         @InjectModel(DB_NOTIFICATION)
//         private readonly notificationModel: Model<NotificationDocument>,
//         @InjectModel(DEVICE_DATA_MODEL)
//         private readonly deviceDataModel: Model<DeviceDataDocument>,
//     ) { }

//     async sendToOneUser(notification: CreateNotificationDTO, userID: string, options: OneSignalOption) {
//         return this.sendAndStoreNoti(notification, options);
//     }

//     private async sendAndStoreNoti(
//         notification: CreateNotificationDTO,
//         options: OneSignalOption,
//     ) {
//         const result = await this.notificationModel.create(notification);
//         options.data = {
//             ...options.data,
//             notiId: result._id,
//         };
//         const mapOneSignalId: { [field: string]: string[] } = {};
//         const deviceData = await this.deviceDataModel.find({ userId: { $in: uniqUserRoleList.map((u) => u.userId) } });
//         options.data = {
//             ...options.data,
//             roleId: u.roleId,
//         };
//         OneSignalService.sendPeople(
//             result.content,
//             listOneSignalId,
//             options,
//             result,
//             result.sentAt.toISOString(),
//         )
//             .then(async (oneSignalNotiId) => {
//                 if (oneSignalNotiId) {
//                     await this.notificationModel.findByIdAndUpdate(result._id, {
//                         $push: { oneSignalNotiId: oneSignalNotiId },
//                     });
//                 }
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//         return result;
//     }
// }
