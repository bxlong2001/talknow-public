import { Body, Controller, Delete, Param, Put, Req } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { DeviceDataService } from "./device-data.service";
import { GetDeviceDataDTO } from "./dto/get-device-data.dto";
import { UpdateDeviceDataDTO } from "./dto/update-device-data.dto";
import { Authorization } from "src/common/decorator/auth.decorator";
import { UserDocument, User } from "../user/entities/user.entity";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { ReqUser } from "../../common/decorator/user.decorator";
import { UserAuthorizedDocument } from "../user/dto/user-authorized.dto";
import { DeviceDataDocument } from "./device-data.schema";

@Controller("device-data")
@ApiTags("DeviceData")
@Authorization()
export class DeviceDataController {
    constructor(private readonly deviceDataService: DeviceDataService) {}

    @Put("my")
    @ApiCreatedResponse({ type: GetDeviceDataDTO })
    async update(@Body() deviceData: UpdateDeviceDataDTO, @ReqUser() user: UserAuthorizedDocument): Promise<any> {
        deviceData.userId = user._id;
        deviceData.jti = user.jti;
        const data = await this.deviceDataService.updateDeviceData(deviceData as DeviceDataDocument);
        return ResponseDto.create(data);
    }

    @Delete("my/device-id/:deviceId")
    async deleteByMyIdAndDeviceID(@Param("deviceId") deviceID: string, @Req() req: Request): Promise<any> {
        const userId = (req.user as UserDocument)._id;
        const data = await this.deviceDataService.deleteOneByUserIDAndDeviceID(userId, deviceID);
        return ResponseDto.create(data);
    }
}
