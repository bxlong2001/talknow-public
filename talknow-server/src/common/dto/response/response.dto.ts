
export class ResponseDto<T = any> {
    statusCode: number;
    data: T;

    constructor(data: T, statusCode?: number) {
        this.data = data;
        this.statusCode = statusCode ?? 200;
    }

    static create<T>(data: T, statusCode?: number): ResponseDto<T> {
        return new ResponseDto(data,statusCode);
    }
}