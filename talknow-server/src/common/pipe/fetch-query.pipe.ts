import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { FetchParam } from "./fetch-param";
import { FetchQueryOption } from "./fetch-query-option.interface";

@Injectable()
export class FetchQueryPipe implements PipeTransform<FetchParam, Promise<FetchQueryOption>> {
    async transform(value: FetchParam, metadata: ArgumentMetadata): Promise<FetchQueryOption> {
        const param: FetchParam = plainToClass(FetchParam, value);
        const errors = await validate(param);
        if (errors.length > 0) {
            throw new BadRequestException("Invalid fetch params");
        }
        const result: FetchQueryOption = {};
        result.select = param.select && JSON.parse(param.select);
        result.sort = (param.sort && JSON.parse(param.sort)) || { _id: -1 };
        return result;
    }
}