import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import configuration from "src/config/configuration";
import * as moment from "moment";
import { Otp, OtpDocument } from "./entities/otp.entity";
import * as speakeasy from 'speakeasy';
import { SettingKey } from "../setting/common/setting.constant";
import { DB_OTP } from "../repository/db-collection";
import { Model } from "mongoose";
// import * as twilio from 'twilio';
import { VerifyOtp } from "./dto/verify-otp.dto";
import { ErrorData } from "src/common/exception/error-data";
import * as telerivet from 'telerivet';

@Injectable()
export class OtpService {
    constructor(
        @InjectModel(DB_OTP)
        private readonly otpModel: Model<OtpDocument>,
    ) { }

    private otpGenerate() {
        const secret = speakeasy.generateSecret({ length: 20 });

        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            step: SettingKey.MINUTES_ACTIVE_OTP
        });

        return otp
    }

    async sendSms(
        soDienThoai: string
    ) {
        const esms = configuration().esms;
        const otpCode = this.otpGenerate();
        const otp = {
            isConfirmSms: false,
            thoiGianTao: moment().toDate(),
            otpCode: otpCode,
            soDienThoai: soDienThoai,
            thoiGianHetHan: moment().add(SettingKey.MINUTES_ACTIVE_OTP, 'seconds').toDate()
            // smsCode: result.data.SMSID,
        } as Otp;

        const tr = new telerivet.API(esms.apiKey);
        const project = tr.initProjectById(esms.secretKey);

        await project.sendMessage({
            content: `Mã OTP của bạn là ${otpCode}. Mã OTP sẽ hết hiệu lực sử dụng trong 1 phút`, 
            to_number: soDienThoai
        }, function(err, message) {
            if(err) {
                throw ErrorData.BadRequest("OTP_INVALID");
            }else {
                console.log(message);
            }
        });
        console.log("otp: ", otp);
        
        
        await this.otpModel.create(otp);
        return true;
    }

    async verifyOtp(doc: VerifyOtp) {
        const now = moment()
        const data = await this.otpModel.findOneAndUpdate({
            otpCode: doc.otp,
            soDienThoai: doc.soDienThoai,
            thoiGianTao: {$lte: now.toDate()},
            thoiGianHetHan: {$gte: now.toDate()},
            isConfirmSms: false,
        }, {
            $set: {
                isConfirmSms: true,
            },
        }, { new: true });
        if (!data) {
            throw ErrorData.BadRequest("OTP_INVALID");
        }
        return true;
    }
}