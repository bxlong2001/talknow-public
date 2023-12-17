import { PageableDto } from "src/common/dto/pageable.dto";
import { Message, MessageDocument } from "../entities/message.entity";

export class ChatPageableDto extends PageableDto<Message> {
    result: MessageDocument[];
}
