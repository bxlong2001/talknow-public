import { ApiProperty, PartialType } from "@nestjs/swagger";
import { DeviceData } from "../device-data.schema";
import { User } from "src/modules/user/entities/user.entity";

export class GetDeviceDataDTO extends PartialType(DeviceData) {
    @ApiProperty()
    // tslint:disable-next-line:variable-name
    readonly _id: string;
    @ApiProperty({ type: "string" })
    readonly userID: User | string;
}
