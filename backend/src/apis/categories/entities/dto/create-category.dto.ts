import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Tên danh mục', example: 'Thời trang' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'Mô tả chi tiết danh mục', example: 'Danh mục thời trang dành cho nam và nữ' })
    @IsOptional()
    @IsString()
    longDescription?: string;

    @ApiPropertyOptional({ description: 'Mô tả ngắn gọn danh mục', example: 'Thời trang' })
    @IsOptional()
    @IsString()
    shortDescription?: string;

    @ApiPropertyOptional({ description: 'ID của danh mục cha (nếu có)', example: 'bcbc4bd8-4c6f-40f3-9746-4dbc7acd0497' })
    @IsOptional()
    @IsString()
    parentId?: string;

    @ApiPropertyOptional({ description: 'ID của file ảnh bìa', example: 'bcbc4bd8-4c6f-40f3-9746-4dbc7acd0497' })
    @IsOptional()
    @IsString()
    cover?: string;
}
