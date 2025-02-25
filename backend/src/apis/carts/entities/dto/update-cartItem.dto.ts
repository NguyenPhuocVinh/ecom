import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { AddProductToCartDto, Product } from "./add-product.entity";
import { Type } from "class-transformer";

export class UpdateCartItemDto extends AddProductToCartDto { }