import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ErrorData {
    // @ApiProperty()
    readonly errorCode: number | string;
    readonly errorDescription: string;

    constructor(errorCode: number | string, errorDescription?: string) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }

    static create(statusCode: HttpStatus, errorCode: string, errorDescription?: string): HttpException {
        return new HttpException(new ErrorData(errorCode, errorDescription), statusCode);
    }

    static BadRequest(errorCode: number | string, errorDescription?: string): HttpException {
        return new BadRequestException(new ErrorData(errorCode, errorDescription));
    }

    static Unauthorized(errorCode: number | string, errorDescription?: string): HttpException {
        return new UnauthorizedException(new ErrorData(errorCode, errorDescription));
    }

    static Forbidden(errorCode: number | string, errorDescription?: string): HttpException {
        return new ForbiddenException(new ErrorData(errorCode, errorDescription));
    }

    static Conflict(errorCode: number | string, errorDescription?: string): HttpException {
        return new ConflictException(new ErrorData(errorCode, errorDescription));
    }
}
