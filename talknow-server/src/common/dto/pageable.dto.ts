import { FetchQueryOption } from "../pipe/fetch-query-option.interface";

export class PageableDto<T = any> {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: T[];

    static create(option: FetchQueryOption, total: number, result: any[]): PageableDto {
        return {
            page: option.page,
            offset: option.skip,
            limit: option.limit,
            total,
            result,
        };
    }
}