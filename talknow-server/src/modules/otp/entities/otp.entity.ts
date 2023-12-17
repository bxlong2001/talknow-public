import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";
import { DB_OTP } from "src/modules/repository/db-collection";

@Schema({
    collection: DB_OTP,
    timestamps: true,
})

export class Otp {
    @IsString()
    @Prop({})
    soDienThoai: string;

    @IsString()
    @IsOptional()
    @Prop()
    smsCode?: string;

    @IsString()
    @Prop()
    otpCode: string;

    @IsDateString()
    @Prop({ type: Date })
    thoiGianTao: Date;

    @IsDateString()
    @Prop({ type: Date })
    thoiGianHetHan: Date;

    @IsBoolean()
    @IsOptional()
    @Prop({ type: Boolean })
    isConfirmSms: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument = Otp & Document;