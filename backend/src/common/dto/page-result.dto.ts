// src/common/dto/page-result.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PagingDto {
    @IsOptional()
    page: number;

    @IsOptional()
    sort?: Record<string, "ASC" | "DESC">;

    @IsOptional()
    fullTextSearch?: { searchTerm: string; offset: number; limit: number } | null;

    @IsOptional()
    search?: Record<string, string>;

    @IsString()
    @IsOptional()
    search_type: string;

    @IsOptional()
    limit?: number;

    @Transform(({ value }) => Number.parseInt(value))
    @IsOptional()
    id?: number;

    @IsOptional()
    filterQuery?: any;

    @IsOptional()
    select?: string[];

    @IsOptional()
    self_questions?: boolean;
}
