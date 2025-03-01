import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
    @ApiProperty({
        description: 'Tên của cửa hàng',
        example: 'Store ABC',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Địa chỉ của cửa hàng',
        example: '123 Đường A, Quận B, TP.C',
    })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({
        description: 'Sdt của cửa hàng',
        example: '0123456789',
    })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsOptional()
    lat: any;

    @ApiProperty()
    @IsOptional()
    lon: any;
}
