import { User, UserDocument } from "../entities/user.entity";

export class UserAuthorizedDto extends User {
    clientDeviceId?: string;
    clientPlatform?: string;
    jti?: string;
}

export type UserAuthorizedDocument = UserAuthorizedDto & UserDocument;