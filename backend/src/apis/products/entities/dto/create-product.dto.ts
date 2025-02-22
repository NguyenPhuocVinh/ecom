import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Tên của sản phẩm',
        example: 'Apple iPhone 13',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'ID của danh mục sản phẩm',
        example: '3d3e51ef-2b2d-4b1f-8f0a-40bd1f8d73ea',
    })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({
        description: 'Mô tả chi tiết của sản phẩm',
        example: 'Sản phẩm có thiết kế đẹp, tính năng vượt trội...',
    })
    @IsOptional()
    @IsString()
    longDescription?: string;

    @ApiProperty({
        description: 'Mô tả ngắn gọn của sản phẩm',
        example: 'iPhone 13, 128GB, Black',
    })
    @IsOptional()
    @IsString()
    shortDescription?: string;

    @ApiProperty({
        description: 'ID của hình ảnh đại diện cho sản phẩm',
        example: 'd3f2c1a5-bd5a-4fef-87e3-2e8a6a43e2ea',
    })
    @IsOptional()
    @IsUUID()
    featuredImages?: string[];

    @ApiProperty({
        description: 'Giá của sản phẩm',
        example: 999.99,
    })
    @IsNotEmpty()
    @IsString()
    price: string;

    @ApiProperty({
        description: 'Số lượng sản phẩm',
    })
    @IsOptional()
    @IsUUID()
    quantity?: number;

    @ApiProperty({
        description: 'ID của cửa hàng',
        example: 'd3f2c1a5-bd5a-4fef-87e3-2e8a6a43e2ea',
    })
    @IsOptional()
    @IsUUID()
    store: string;
}
