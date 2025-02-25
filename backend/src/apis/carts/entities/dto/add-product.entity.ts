import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class Product {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    attribute: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    variant: string;
}

export class AddProductToCartDto {
    @ApiProperty({ type: Product })
    @ValidateNested()
    @Type(() => Product)
    product: Product;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}
