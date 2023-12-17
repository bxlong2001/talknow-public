import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { OtpService } from "./otp.service";

@Controller("otp")
@ApiTags("Otp")
export class OtpController {
    constructor(
        private readonly otpService: OtpService,
    ) { }

    // @Post()
    // async createSms(
    //     @Body() doc: CreateOtpDto,
    // ) {
    //     const data = await this.otpService.sendSms(doc.soDienThoai);
    //     return ResponseDto.create(data);
    // }
}
