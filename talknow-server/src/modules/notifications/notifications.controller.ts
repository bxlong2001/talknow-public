// import { Body, Controller, Get, Param, Post, Put, Delete, Query, Req } from "@nestjs/common";
// import { ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
// import { Request } from "express";
// import { ApiPageableQuery, ApiSortQuery, FetchPageableQuery } from "src/common/decorator/api.decorator";
// import { AllowSystemRoles, Authorization } from "src/common/decorator/auth.decorator";
// import { ReqUser } from "src/common/decorator/user.decorator";
// import { ResponseDto } from "src/common/dto/response/response.dto";
// import { FetchQueryOption } from "src/common/pipe/fetch-query-option.interface";
// import { OneSignalOption } from "src/config/one-signal";
// import { ESystemRole } from "../user/common/user.constant";
// import { UserDocument } from "../user/entities/user.entity";
// import { ENotificationSentType, ENotificationStatus } from "./common/notifications.constants";
// import { CreateNotificationDTO } from "./dto/create-notification.dto";
// import { NotificationsService } from "./notifications.service";

// @ApiTags("Notifications")
// @Controller("notifications")
// @Authorization()
// export class NotificationsController {
//     constructor(private readonly notificationsService: NotificationsService) { }

//     @Post("send-one")
//     @ApiOperation({ summary: "Gửi 1 người dùng, dùng user là id của user" })
//     @ApiCreatedResponse({ type: CreateNotificationDTO })
//     async sendToUser(@Body() notification: CreateNotificationDTO, @ReqUser() user: UserDocument): Promise<Notification> {
//         notification.senderID = user._id;
//         if (!notification.sentAt) {
//             notification.sentAt = new Date();
//         }
//         Object.assign(notification, {
//             info: {
//                 type: notification.type,
//             },
//         });
//         return this.notificationsService.sendToOneUser(notification, notification.receiverID);
//     }
// }
