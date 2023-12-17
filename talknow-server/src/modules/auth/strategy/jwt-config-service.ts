import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import configuration from "src/config/configuration";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(
        private readonly configService: ConfigService
    ) { }
    createJwtOptions(): JwtModuleOptions {
        const expiresIn = configuration().jwt.exp;
        const signOptions = { ...(expiresIn !== undefined && { expiresIn }) };
        return {
            secret: this.configService.get("jwt.secret"),
            signOptions,
        };
    }
}