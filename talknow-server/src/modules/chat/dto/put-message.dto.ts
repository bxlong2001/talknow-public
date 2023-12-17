import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";
import { Message } from "../entities/message.entity";

export class PutMessagerDto extends PartialType(PickType(Message, ["content"])) {}