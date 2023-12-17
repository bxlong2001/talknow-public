import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginRequestDto {
    /**
     * Username
     * @example username
     */
    @IsString()
    username: string;
    /**
     * Password
     * @example password
     */
    @IsString()
    password: string;
    /**
     * Username
     * @example deviceId
     */
    @IsString()
    deviceId: string;

    @IsString()
    @IsOptional()
    oneSignalId?: string;
}