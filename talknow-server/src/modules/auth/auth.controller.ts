import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { ApiUnauthorizedDoc } from "../../common/decorator/api.decorator";
// import { ReqUser } from "../../common/decorator/user.decorator";
import { UserDocument } from "../user/entities/user.entity";
import { LoginRequestDto } from "./dto/login-request.dto";
import { AuthErrorCode } from "./common/auth.constant";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { VerifyPhonenumber } from "./dto/verify-phonenumber.dto";
import { VerifyOtp } from "../otp/dto/verify-otp.dto";
import { ReqUser } from "src/common/decorator/user.decorator";
import { LoginResultsResponseDto } from "./dto/response/login-results-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { FogotPassword } from "./dto/fogot-password.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor (
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginRequestDto })
    @Post("login/mobile")
    @ApiUnauthorizedDoc(
        { errorCode: AuthErrorCode.UNAUTHORIZED_USERNAME_NOT_FOUND, errorDescription: "Không tìm thấy username" },
        { errorCode: AuthErrorCode.UNAUTHORIZED_WRONG_PASSWORD, errorDescription: "Sai mật khẩu" },
    )
    async loginMobile(
        @ReqUser() user: UserDocument,
        @Body() loginInfo: LoginRequestDto,
    ): Promise<LoginResultsResponseDto> {
        const data = await this.authService.loginMobile(user, loginInfo);
        return ResponseDto.create(data);
    }

    @Post("register")
    async verifyPhonenumberAdd(
        @Body() body: VerifyPhonenumber
    ) {
        const data = await this.authService.registerMobile(body);
        return ResponseDto.create(data);
    }
    
    @Post("verify")
    async verifyOTP(
        @Body() body: VerifyOtp
    ) {
        const data = await this.authService.verifyOtp(body);
        return ResponseDto.create(data);
    }

    @Post("forgot")
    async forgotPassword(
        @Body() body: FogotPassword
    ) {
        const data = await this.authService.forgotPassword(body);
        return ResponseDto.create(data);
    }
}