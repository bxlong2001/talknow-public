import { Body, Controller, Get, Post, Query, Put, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { Authorization } from "src/common/decorator/auth.decorator";
import { CreateUserDto } from "src/modules/auth/dto/create-user.dto";
import { UserResponseDto } from "../dto/response/user-response.dto";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { ReqUser } from "src/common/decorator/user.decorator";
import { UserDocument } from "../entities/user.entity";
import { ApiBadRequestDoc, ApiPageableQuery, FetchPageableQuery } from "src/common/decorator/api.decorator";
import { FetchQueryOption } from "src/common/pipe/fetch-query-option.interface";
import { UserPageableResponseDto } from "../dto/response/user-pageable-response.dto";
import { UserErrorCode } from "../common/user.constant";
import { ChangePasswordDto } from "../dto/response/change-password.dto";
import { LoginResultsResponseDto } from "src/modules/auth/dto/response/login-results-response.dto";
@Controller("user")
@ApiTags("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserResponseDto> {
        const data = await this.userService.createUser(createUserDto)
        return ResponseDto.create(data);
    }

    @Get()
    @Authorization()
    @ApiPageableQuery()
    @ApiQuery({ name: "cond", required: false })
    async findPageable(
        @ReqUser() user: UserDocument,
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("cond") cond: any,
    ): Promise<UserPageableResponseDto> {
        const data = await this.userService.findPageable(cond, option, user);
        return ResponseDto.create(data);
    }

    @Get("me")
    @Authorization()
    async findMe(@ReqUser() user: UserDocument): Promise<UserResponseDto> {
        const data = await this.userService.findProfileByJWT(user);
        return ResponseDto.create(data);
    }

    @Post("me/change/password")
    @Authorization()
    @ApiBadRequestDoc(
        {
            errorCode: UserErrorCode.BAD_REQUEST_WRONG_OLD_PASSWORD,
            errorDescription: "Mật khẩu cũ không chính xác",
        },
        {
            errorCode: UserErrorCode.BAD_REQUEST_DUPLICATE_NEW_PASSWORD,
            errorDescription: "Mật khẩu cũ trùng với mật khẩu mới",
        },
    )
    async userChangePassword(
        @ReqUser() user: UserDocument,
        @Body() changePassword: ChangePasswordDto,
    ) {
        await this.userService.changePassword(user, changePassword);
    }

    @Put("add-friend/:friendId")
    @Authorization()
    async addFriend(
        @ReqUser() user: UserDocument,
        @Param("friendId") id: string,
        @Body() body: any
    ) {
        await this.userService.addFriend(user, id, body.status);
    }

    @Get("friend-request")
    @Authorization()
    @ApiQuery({ name: "cond", required: false })
    async getFriendRequest(
        @ReqUser() user: UserDocument,
        @Query("cond") cond: any,
    ) {
        const conditions = cond ? cond : {}
        const data = await this.userService.getFriendRequest(user, conditions);
        return ResponseDto.create(data);
    }
}