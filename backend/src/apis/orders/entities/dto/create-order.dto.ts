import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateOrderDto {
    @ApiPropertyOptional({ description: "ID giỏ hàng (nếu có)" })
    @IsUUID()
    @IsOptional()
    cartId?: string;

    @ApiPropertyOptional({ description: "ID cửa hàng" })
    @IsUUID()
    @IsOptional()
    storeId?: string

    @ApiProperty({ description: "Danh sách item trong giỏ hàng" })
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    items: string[];

    @ApiProperty({ description: "Họ của khách hàng" })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ description: "Tên của khách hàng" })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ description: "Họ và tên đầy đủ", required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({ description: "Sdt của khách hàng" })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ description: "Địa chỉ giao hàng" })
    @IsString()
    @IsNotEmpty()
    shippingAddress: string;
}
