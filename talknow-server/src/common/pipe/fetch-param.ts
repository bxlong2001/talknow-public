import { IsString, IsOptional } from "class-validator";

export class FetchParam {
    @IsString()
    @IsOptional()
    select?: string;

    @IsString()
    @IsOptional()
    sort?: string;
}