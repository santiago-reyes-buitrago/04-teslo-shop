import {IsOptional, IsPositive, Min} from "class-validator";
import {Type} from "class-transformer";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit?: number;
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    skip?: number;
}