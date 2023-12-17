import { PickType } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";

export class CreateUserDto extends PickType(User, ["soDienThoai", "password", "hoTen", "role", "dhPublicKey", "rsaPublicKey"]) {}