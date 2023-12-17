import { ResponseDto } from "src/common/dto/response/response.dto";
import { ChatPageableDto } from "../chat-pageable.dto";

export class ChatPageableResponseDto extends ResponseDto<ChatPageableDto> {
    data: ChatPageableDto;
}
