import { PartialType } from "@nestjs/swagger";
import { Notification } from "../entities/notifications.entity";

export class CreateNotificationDTO extends PartialType(Notification) {}
