import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { OtpService } from "../otp/otp.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtConfigService } from "./strategy/jwt-config-service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
// import { JwtConfigService } from "./strategy/jwt-config-service";
// import { JwtStrategy } from "./strategy/jwt.strategy";
// import { LocalStrategy } from "./strategy/local.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, OtpService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
