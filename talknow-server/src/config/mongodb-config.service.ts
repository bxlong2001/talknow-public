import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(
        private readonly configService: ConfigService,
    ) { }
    createMongooseOptions(): MongooseModuleOptions {
        const dbHost = this.configService.get<string>("database.host");
        const dbPort = this.configService.get<number>("database.port");
        const dbName = this.configService.get<string>("database.name");
        return {
            uri: `mongodb://${dbHost}:${dbPort}/${dbName}?authSource=admin&directConnection=true`,
            user: this.configService.get("database.username"),
            pass: this.configService.get("database.password"),
            // useUnifiedTopology: true,
            // useNewUrlParser: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
            // retryDelay: 5000,
        };
    }
}