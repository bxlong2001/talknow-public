import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { DB_USER } from "../../repository/db-collection";
import { UserAuthorizedDocument } from "../../user/dto/user-authorized.dto";
import { UserDocument } from "../../user/entities/user.entity";
import { JwtPayload } from "../dto/jwt-payload";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("jwt.secret"),
        });
    }

    async validate(payload: JwtPayload): Promise<UserAuthorizedDocument> {
        const user: UserAuthorizedDocument = await this.userModel.findOne({
            _id: payload.sub.userId,
        }).select("-password");
        if (user) {
            // if (payload.sub.authorizationVersion !== user.authorizationVersion.version) {
            //     return undefined;
            // }
            user.role = payload.sub.role;
            // user.systemRoles = [payload.sub.role?.systemRole];
            user.clientDeviceId = payload.sub.deviceId;
            user.clientPlatform = payload.sub.platform;
            user.jti = payload.jti;
            return user;
        }
        return undefined;
    }
}
