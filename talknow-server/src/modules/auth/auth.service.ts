import { VerifyOtp } from './../otp/dto/verify-otp.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DB_DEVICE_DATA, DB_USER } from "../repository/db-collection";
import { Model, mongo } from "mongoose";
import { UserDocument } from "../user/entities/user.entity";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResultDto } from "./dto/login-result.dto";
import configuration from "src/config/configuration";
import { ErrorData } from "../../common/exception/error-data";
import { AuthErrorCode } from "./common/auth.constant";
import { JwtPayload } from "./dto/jwt-payload";
import { ClientPlatform } from "src/config/constant";
import { JwtService } from "@nestjs/jwt";
import { VerifyPhonenumber } from "./dto/verify-phonenumber.dto";
import { OtpService } from "../otp/otp.service";
import { ESystemRole } from '../user/common/user.constant';
import { FogotPassword } from './dto/fogot-password.dto';
// import { DeviceData, DeviceDataDocument } from '../device-data/device-data.schema';
import * as uuid from "uuid";
import { DeviceData, DeviceDataDocument } from '../device-data/device-data.schema';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceData: Model<DeviceDataDocument>,
    ) {}

    async validateUser(soDienThoai: string, password: string): Promise<UserDocument> {
        const user = await this.userModel
            .findOne({ soDienThoai: soDienThoai.toLowerCase() })
        if (user) {
            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                return user;
            }
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_WRONG_PASSWORD);
        } else {
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_USERNAME_NOT_FOUND);
        }
    }

    async loginMobile(user: UserDocument, loginInfo: LoginRequestDto): Promise<LoginResultDto> {
        const jti = uuid.v4();
        if (!loginInfo.oneSignalId) {
            throw ErrorData.BadRequest("ONESIGNAL_ID_REQUIRED");
        }
        await this.deviceData
            .updateOne(
                { oneSignalId: loginInfo.oneSignalId },
                {
                    oneSignalId: loginInfo.oneSignalId,
                    userId: user._id,
                    deviceId: loginInfo.deviceId,
                    jti,
                },
                { upsert: true },
            )
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                // authorizationVersion: user.authorizationVersion.version,
                platform: ClientPlatform.MOBILE,
                deviceId: loginInfo.deviceId,
                role: user.role,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        const accessToken = this.jwtService.sign(payload);
        return { role: user.role, accessToken };
    }

    async registerMobile(body: VerifyPhonenumber) {
        const existedPhone = await this.userModel.findOne({username: body.soDienThoai.replace(/^0/, '84') })
        if (existedPhone) {
            throw ErrorData.BadRequest("Số điện thoại đã được đăng ký");
        }
        const data = await this.otpService.sendSms(body.soDienThoai);
        return data;
    }

    async verifyOtp(body: VerifyOtp) {
        await this.otpService.verifyOtp(body);
    }

    async forgotPassword(
        body: FogotPassword
    ) {
        const {
            otpCode,
            ...data
        } = body;
        const isVerify = await this.otpService.verifyOtp({
            otp: otpCode,
            soDienThoai: data.soDienThoai,
        });
        if (isVerify) {
            const soDienThoai = body.soDienThoai.replace(/^0/, '84') 
            const user = await this.userModel.findOne({
                soDienThoai
            });
            if (!user) {
                throw ErrorData.BadRequest("USER_NOT_FOUND");
            }
            user.password = data.password;
            await user.save();
            return user;
        }
    }
}