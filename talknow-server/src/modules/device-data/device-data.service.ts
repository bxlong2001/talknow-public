import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Promise } from "bluebird";
import { Model } from "mongoose";
import { OneSignalService } from "src/config/one-signal";
import { DB_DEVICE_DATA, DB_USER } from "../repository/db-collection";
import { UserDocument } from "../user/entities/user.entity";
import { DeviceDataDocument } from "./device-data.schema";

@Injectable()
export class DeviceDataService {
    constructor(
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceDataModel: Model<DeviceDataDocument>,
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async getOneSignalIDList(filters?: any): Promise<string[]> {
        const result = await this.deviceDataModel.find(filters).select({ oneSignalId: 1 }).lean().exec();
        return result.map((data) => data.oneSignalId);
    }

    async updateDeviceData(deviceData: DeviceDataDocument): Promise<DeviceDataDocument> {
        await this.deviceDataModel
            .deleteMany({
                $or: [{ deviceID: deviceData.deviceId }, { onesignalID: deviceData.oneSignalId }],
            })
            .exec();
        return this.deviceDataModel
            .findOneAndUpdate(
                {
                    userId: deviceData.userId,
                    deviceID: deviceData.deviceId,
                    jti: deviceData.jti,
                },
                deviceData,
                {
                    runValidators: true,
                    upsert: true,
                },
            )
            .then(async (result) => {
                if (deviceData?.oneSignalId) {
                    await OneSignalService.subscribe(deviceData.oneSignalId);
                }
                return result;
            });
    }

    async deleteOneByUserIDAndDeviceID(userId: string, deviceID: string): Promise<DeviceDataDocument> {
        return this.deviceDataModel
            .findOneAndDelete({ userId, deviceID })
            .exec()
            .then(async (result) => {
                if (result?.oneSignalId) {
                    await OneSignalService.unsubscribe(result.oneSignalId);
                }
                return result;
            });
    }
}
