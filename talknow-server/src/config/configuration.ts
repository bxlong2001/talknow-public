import { Logger } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config();

export enum Environment {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development"
}

const logger = new Logger("Configuration");

export const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        logger.warn(`${key} not found`);
    }
    return value;
};

export interface Configuration {
    env: Environment;
    server: {
        port: number;
        address: string;
    };
    database: {
        host: string;
        port: number;
        username?: string;
        password?: string;
        name: string;
    };
    jwt: {
        secret: string;
        exp: number;
    };
    onesignal: {
        id: string;
        key: string;
    };
    esms: {
        apiKey: string;
        secretKey: string;
        address: string;
    }
    projectDir: string;
    corsOrigins: string[]|string;
}

export default (): Configuration => {
    // Environment
    const env = getEnv("NODE_ENV") as Environment;

    // Server
    const serverPort = parseInt(getEnv("SERVER_PORT"), 10) || 6000;
    const serverAddress = getEnv("SERVER_ADDRESS") || `http://localhost:${serverPort}`;

    // Database
    const databaseHost = encodeURI(getEnv("DB_HOST"));
    const databasePort = parseInt(getEnv("DB_PORT"), 10);
    const databaseUsername = getEnv("DB_USER");
    const databasePassword = getEnv("DB_PASSWORD");
    const databaseName = getEnv("DB_NAME");

    // JWT
    const jwtSecret = getEnv("JWT_SECRET");
    const jwtExp = getEnv("JWT_EXP");

    const onesignalId = getEnv("ONE_SIGNAL_APP_ID");
    const onesignalKey = getEnv("ONE_SIGNAL_API_KEY");

    // ESMS
    const secretKey = getEnv("ESMS_SECRET_KEY");
    const apiKey = getEnv("ESMS_API_KEY");
    const address = getEnv("DOMAIN_ESMS");
    
    const corsOrigins = getEnv("CORS_ORIGINS") ? JSON.parse(getEnv("CORS_ORIGINS")) : "*";
    return {
        env,
        server: {
            port: serverPort,
            address: serverAddress,
        },
        database: {
            host: databaseHost,
            port: databasePort,
            username: databaseUsername,
            password: databasePassword,
            name: databaseName
        },
        jwt: {
            secret: jwtSecret,
            exp: jwtExp && parseInt(jwtExp, 10),
        },
        onesignal: {
            id: onesignalId,
            key: onesignalKey,
        },
        esms: {
            secretKey,
            apiKey,
            address,
        },
        projectDir: path.resolve(__dirname + "/../.."),
        corsOrigins,
    }
}