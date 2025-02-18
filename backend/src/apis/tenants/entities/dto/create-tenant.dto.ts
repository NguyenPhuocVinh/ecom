import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    isRoot: boolean;

    @IsOptional()
    @IsUUID()
    logo?: string;
}
