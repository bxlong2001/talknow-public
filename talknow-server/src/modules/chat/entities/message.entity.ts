import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsDateString, IsString } from "class-validator";
import { Document } from "mongoose";
import { DB_MESSAGE, DB_ROOM, DB_USER } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";

@Schema({
    collection: DB_MESSAGE,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
})

export class Message {
    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER })
    senderId: string;

    @IsString()
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: DB_USER }])
    receiverId: string[];

    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_ROOM })
    roomId: string;

    @IsString()
    @Prop({ required: true })
    content: string;

    @IsDateString()
    @Prop({ required: true })
    thoiGianGui: Date;

    @IsString()
    @Prop({ required: true, default: 'mess' })
    type: string;

    @IsBoolean()
    @Prop({ default: false })
    signed: boolean;

    @IsBoolean()
    @Prop({ default: false })
    seen: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.virtual("sender", {
    ref: DB_USER,
    localField: "senderId",
    foreignField: "_id",
    justOne: true,
})
MessageSchema.virtual("receiver", {
    ref: DB_USER,
    localField: "receiverId",
    foreignField: "_id",
    justOne: true,
})
MessageSchema.virtual("room", {
    ref: DB_USER,
    localField: "roomId",
    foreignField: "_id",
    justOne: true,
})
export type MessageDocument = Message & Document;