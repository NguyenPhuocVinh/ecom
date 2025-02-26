import { PartialType } from "@nestjs/swagger";
import { CreateDiscountDto } from "./create-discout.dto";

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) { }