import { ApiTags } from "@nestjs/swagger";
import { DHService } from "./dh.service";
import { Authorization } from "src/common/decorator/auth.decorator";
import { Body, Controller, Post, Res, Get } from "@nestjs/common";
import { ReqUser } from "src/common/decorator/user.decorator";
import { UserDocument } from "../user/entities/user.entity";
import { ResponseDto } from "src/common/dto/response/response.dto";

@Controller("dh")
@ApiTags("Diffie Hellman")
// @Authorization()
export class DHController {
    constructor(
        private readonly dhService: DHService,
    ) { }

    @Get()
    async getPrime(
        @ReqUser() user: UserDocument
    ) {
        const data = await this.dhService.findPrime();
        return ResponseDto.create(data);
    }
}
