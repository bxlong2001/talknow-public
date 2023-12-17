import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongodb";
import * as mongoose from "mongoose";
import { DB_USER } from "src/modules/repository/db-collection";
import { User } from "src/modules/user/entities/user.entity";

export const DB_NOTIFICATION = "Notifications";

@Schema({
    timestamps: true,
    collection: DB_NOTIFICATION,
    toJSON: {
        virtuals: true,
    },
})
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER })
    senderID: ObjectId | string | User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER })
    receiverID: ObjectId | string | User;

    @ApiProperty()
    @Prop({ required: true })
    content: string;

    @ApiProperty()
    @Prop({ default: Date.now })
    sentAt: Date;

    @ApiProperty()
    @Prop({ type: String })
    type: string;

    @Prop()
    oneSignalNotiId: string[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: 1 });

export type NotificationDocument = Notification & mongoose.Document;
