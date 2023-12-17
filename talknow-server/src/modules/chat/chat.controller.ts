import { Body, Controller, Get, Post, Query, Put, Param } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { Authorization } from "src/common/decorator/auth.decorator";
import { CreateMessagerDto } from "./dto/create-message.dto";
import { ChatResponseDto } from "./dto/response/chat-response.dto";
import { ReqUser } from "src/common/decorator/user.decorator";
import { UserDocument } from "../user/entities/user.entity";
import { ApiPageableQuery, FetchPageableQuery } from "src/common/decorator/api.decorator";
import { FetchQueryOption } from "src/common/pipe/fetch-query-option.interface";
import { ChatPageableResponseDto } from "./dto/response/chat-pageable-response.dto";
import { PutMessagerDto } from "./dto/put-message.dto";
@Controller("chat")
@ApiTags("Chat")
@Authorization()
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async create(
        @Body() createMessageDto: CreateMessagerDto,
    ): Promise<ChatResponseDto> {
        const data = await this.chatService.createMessage(createMessageDto)
        return ResponseDto.create(data);
    }

    @Get("pageable")
    @ApiPageableQuery()
    @ApiQuery({ name: "cond", required: false })
    async findPageable(
        @ReqUser() user: UserDocument,
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("cond") cond: any,
    ): Promise<ChatPageableResponseDto> {
        const data = await this.chatService.findPageable(cond, option, user);
        return ResponseDto.create(data);
    }

    @Get("room/pageable")
    @ApiPageableQuery()
    @ApiQuery({ name: "cond", required: false })
    async findPageableRoom(
        @ReqUser() user: UserDocument,
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("cond") cond: any,
    ): Promise<ChatPageableResponseDto> {
        const conditions = cond ? cond : {}
        const data = await this.chatService.findPageableRoom(conditions, option, user);
        return ResponseDto.create(data);
    }

    @Get("my-message")
    @ApiQuery({ name: "cond", required: false })
    async findLastMessage(
        @ReqUser() user: UserDocument,
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("cond") cond: any,
    ) {
        const conditions = cond ? cond : {}
        const data = await this.chatService.findMyMessage(conditions, user);
        return ResponseDto.create(data);
    }

    @Put("verify/:id")
    async verify(
        @ReqUser() user: UserDocument,
        @Body() createMessageDto: PutMessagerDto,
        @Param("id") id: string,
    ): Promise<ChatResponseDto> {
        const data = await this.chatService.verifyMessage(id, createMessageDto, user)
        return ResponseDto.create(data);
    }
}