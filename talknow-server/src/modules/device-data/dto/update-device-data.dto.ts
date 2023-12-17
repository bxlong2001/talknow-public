import { OmitType, PartialType } from "@nestjs/swagger";
import { DeviceData } from "../device-data.schema";

export class UpdateDeviceDataDTO extends PartialType(OmitType(DeviceData, ["userId", "jti"])) {
    userId: string;
    jti: string;
}
