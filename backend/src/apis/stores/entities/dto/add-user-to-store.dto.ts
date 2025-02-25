import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddUserToStoreDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: string
}