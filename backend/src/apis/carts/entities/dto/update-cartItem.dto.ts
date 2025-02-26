import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { AddProductToCartDto, Product } from "./add-product.entity";
import { Type } from "class-transformer";

export class UpdateCartItemDto extends AddProductToCartDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}