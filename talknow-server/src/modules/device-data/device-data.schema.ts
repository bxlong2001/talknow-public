import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApiProperty } from "@nestjs/swagger";
import { DB_DEVICE_DATA, DB_USER } from "../repository/db-collection";
import { User } from "../user/entities/user.entity";
import { IsString } from "class-validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
    collection: DB_DEVICE_DATA,
    toJSON: {
        virtuals: true,
    },
})
export class DeviceData {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER })
    userId: ObjectId | string | User;

    @Prop()
    @IsString()
    jti: string;

    @Prop()
    @IsString()
    deviceId: string;

    @Prop()
    @IsString()
    deviceName?: string;

    @IsString()
    @Prop({ required: true })
    oneSignalId: string;
}

export const DeviceDataSchema = SchemaFactory.createForClass(DeviceData)
export interface DeviceDataDocument extends DeviceData, mongoose.Document {}