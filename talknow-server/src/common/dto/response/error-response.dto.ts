import { OmitType } from "@nestjs/swagger";
import { ResponseDto } from "./response.dto";

export class ErrorResponseDto extends OmitType(ResponseDto, [
    "data",
]) {
    timestamp: Date;
    method: string;
    path: string;
    errorCode: string;
    errorDescription: string;
    message: string;

    constructor(timestamp: Date, method: string, path: string, errorCode: string, errorDescription: string, message: string) {
        super();
        this.timestamp = timestamp;
        this.method = method;
        this.path = path;
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.message = message;
    }
}