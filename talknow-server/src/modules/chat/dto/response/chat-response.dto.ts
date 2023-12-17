import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { Message } from "../../entities/message.entity";

export class ChatResponseDto extends ResponseDto<Message> {
    data: Message;
}