import { Logger } from "@nestjs/common";
import * as OneSignal from "onesignal-node";
// import { NotificationDocument } from "../modules/notifications/entities/notifications";
import configuration from "./configuration";

export interface OneSignalData {
    type: string;
    [field: string]: any;
}

export interface OneSignalOption {
    data: OneSignalData;
    [options: string]: any;
}

class OneSignalNotification {
    private readonly limitEntries: number = 2000;
    private readonly logger: Logger = new Logger("OneSignal");

    private appId: string;
    private apiKey: string;
    private client: OneSignal.Client;

    constructor(appId: string, apiKey: string) {
        this.appId = appId;
        this.apiKey = apiKey;
        this.client = new OneSignal.Client(this.appId, this.apiKey);
    }

    async subscribe(oneSignalID: string) {
        try {
            const res = await this.client.editDevice(oneSignalID, {
                notification_types: 1,
            });
            return res;
        } catch (err) {
            console.error("Error subscribe OneSignalID", oneSignalID, err?.body || err?.message);
        }
    }

    async unsubscribe(oneSignalID: string) {
        try {
            const res = await this.client.editDevice(oneSignalID, {
                notification_types: -2,
            });
            return res;
        } catch (err) {
            console.error("Error unsubscribe OneSignalID", oneSignalID, err?.body || err?.message);
        }
    }

    async sendPeople(
        content: string,
        people: string[],
        notificationOptions?: OneSignalOption,
        // notif?: NotificationDocument,
        bigPictureUrl?: string,
        sendTime?: string,
    ): Promise<string> {
        const receivers = people.filter((item,index)=>index === people.findIndex((person)=>JSON.stringify(person) === JSON.stringify(item)));
        try {
            const notification = {
                contents: { en: content },
                include_player_ids: receivers,
                adm_big_picture: bigPictureUrl,
                big_picture: bigPictureUrl,
                chrome_web_image: bigPictureUrl,
                chrome_big_picture: bigPictureUrl,
                ...notificationOptions,
            };
            if (sendTime) {
                Object.assign(notification, { send_after: sendTime });
            }
            return this.client
                .createNotification(notification)
                .then(async (data) => {
                    this.logger.log(data.body);
                    return data.body?.id;
                })
                .catch((err) => {
                    console.error(JSON.stringify(err));
                });
        } catch (err) {
            this.logger.warn("OneSignal error sendPeople");
        }
    }

    async setNoti(title: string, content: string, people: string[], notificationOptions: OneSignalOption) {
        try {
            while (people.length > 0) {
                const block = people.splice(0, this.limitEntries);
                const notification = {
                    contents: { en: content },
                    include_player_ids: block,
                    ...notificationOptions,
                };
                return this.client
                    .createNotification(notification)
                    .then((data) => {
                        this.logger.log(data.body);
                        return data;
                    })
                    .catch((err) => {
                        console.error(JSON.stringify(err));
                    });
            }
        } catch (err) {
            this.logger.warn("OneSignal error sendPeople");
        }
    }

    cancelNoti(notiID: string): void {
        try {
            this.client.cancelNotification(notiID);
        } catch (err) {
            this.logger.warn("OneSignal error cancle noti");
        }
    }
}

export const OneSignalService = new OneSignalNotification("95c05e0b-807d-49be-9f24-e741d6a427a6", "MTM5YjY4ZWItMWM1Yy00NDZlLThjZmMtNWQyMGFlOTQyMzZk");
