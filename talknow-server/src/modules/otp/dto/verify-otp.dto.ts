import { IsString } from "class-validator";

export class VerifyOtp {
    @IsString()
    otp: string;

    @IsString()
    soDienThoai: string;
}