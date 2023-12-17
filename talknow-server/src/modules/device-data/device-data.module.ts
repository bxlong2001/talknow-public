import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DeviceDataController } from "./device-data.controller";
import { DeviceDataService } from "./device-data.service";

@Module({
    imports: [
        forwardRef(() => AuthModule),
    ],
    controllers: [DeviceDataController],
    providers: [DeviceDataService],
    exports: [DeviceDataService],
})
export class DeviceDataModule { }
