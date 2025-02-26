import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { DISCOUNT_CONDITION, DISCOUNT_STATUS, DISCOUNT_TYPE } from 'src/common/constants/enum';

export class CreateDiscountDto {
    @ApiProperty({ example: 'SUMMER2025', description: 'Mã giảm giá' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 20, description: 'Giá trị giảm giá' })
    @IsNotEmpty()
    @IsNumber()
    value: number;

    @ApiPropertyOptional({ example: 'PERCENT', enum: DISCOUNT_TYPE, description: 'Loại giảm giá' })
    @IsEnum(DISCOUNT_TYPE)
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())  // Chuyển thành chữ hoa
    type?: DISCOUNT_TYPE = DISCOUNT_TYPE.PERCENT;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z', description: 'Ngày hết hạn' })
    @IsOptional()
    @Transform(({ value }) => new Date(value)) // Chuyển đổi từ chuỗi sang Date
    expiredAt?: Date;

    @ApiProperty({ example: '2025-06-01T00:00:00.000Z', description: 'Ngày bắt đầu hiệu lực' })
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value)) // Chuyển đổi từ chuỗi sang Date
    startDay: Date;

    @ApiPropertyOptional({ example: 'ALL', enum: DISCOUNT_CONDITION, description: 'Điều kiện áp dụng' })
    @IsEnum(DISCOUNT_CONDITION)
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase()) // Chuyển thành chữ hoa
    condition?: DISCOUNT_CONDITION = DISCOUNT_CONDITION.ALL;

    @ApiPropertyOptional({ example: 'Giảm giá mùa hè 2025', description: 'Mô tả giảm giá' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 100, description: 'Giới hạn số lượng sử dụng' })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ example: 'ACTIVED', enum: DISCOUNT_STATUS, description: 'Trạng thái giảm giá' })
    @IsEnum(DISCOUNT_STATUS)
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase()) // Chuyển thành chữ hoa
    status?: DISCOUNT_STATUS = DISCOUNT_STATUS.ACTIVED;

    @ApiPropertyOptional({ example: 50000, description: 'Giảm giá tối đa (chỉ áp dụng cho %)' })
    @IsOptional()
    @IsNumber()
    maxDiscount?: number;

    @ApiPropertyOptional({ example: 'store_123', description: 'ID cửa hàng áp dụng (nếu có)' })
    @IsOptional()
    @IsString()
    storeId?: string;
}
