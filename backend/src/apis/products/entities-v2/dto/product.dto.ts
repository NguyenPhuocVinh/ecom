import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSkuAttributeDto {
    @IsOptional()
    @IsString()
    attribute_id?: string;

    @IsOptional()
    @IsString()
    attribute_name?: string;

    @IsOptional()
    @IsString()
    attribute_value_id?: string;

    @IsOptional()
    @IsString()
    attribute_value?: string;
}

export class SkuAttributeDto {
    @IsNotEmpty()
    @IsString()
    attribute_name: string;

    @IsNotEmpty()
    @IsString()
    attribute_value: string;
}

export class InventoryDto {
    @IsNotEmpty()
    @IsString()
    store_id: string;

    @IsNotEmpty()
    @IsNumber()
    stock_quantity: number;
}


export class CreateSkuDto {
    @IsNotEmpty()
    @IsString()
    sku_code: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SkuAttributeDto)
    attributes: SkuAttributeDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InventoryDto)
    inventories: InventoryDto[];
}

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category_id?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSkuDto)
    skus: CreateSkuDto[];
}
