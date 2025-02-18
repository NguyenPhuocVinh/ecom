import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString({}, { message: 'birthdate phải là một định dạng ngày hợp lệ (YYYY-MM-DD)' })
    birthdate?: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    role?: string;
}
