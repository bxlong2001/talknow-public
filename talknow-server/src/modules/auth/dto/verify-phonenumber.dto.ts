import { IsNotEmpty, IsString } from "class-validator";

export class VerifyPhonenumber {
    @IsString()
    @IsNotEmpty()
    soDienThoai: string;
}