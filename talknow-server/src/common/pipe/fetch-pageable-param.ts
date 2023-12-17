import { IsNumberString } from "class-validator";
import { FetchParam } from "./fetch-param";

export class FetchPageableParam extends FetchParam {
    @IsNumberString()
    page?: string;

    @IsNumberString()
    limit?: string;
}