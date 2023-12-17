import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";
import { DB_ROOM, DB_USER } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { UserDocument } from "src/modules/user/entities/user.entity";

@Schema({
    collection: DB_ROOM,
    timestamps: true,
})

export class Room {
    @IsString()
    @Prop()
    roomCode: string;

    @IsString()
    @Prop()
    roomName?: string;

    @IsArray()
    @IsOptional()
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: DB_USER }] })
    danhSachUser: UserDocument[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
export type RoomDocument = Room & Document;