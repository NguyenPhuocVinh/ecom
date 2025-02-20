import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTenantDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    isRoot: boolean;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    logo?: string;
}
