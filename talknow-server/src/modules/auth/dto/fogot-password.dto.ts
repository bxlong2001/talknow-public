import { PartialType, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { User } from "src/modules/user/entities/user.entity";

export class FogotPassword extends PartialType(PickType(User, ["soDienThoai", "password"])) {
    @IsString()
    otpCode: string;

}