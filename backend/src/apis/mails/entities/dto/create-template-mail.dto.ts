import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateMailDto {
    @ApiProperty({
        description: 'The name of the email template.',
        example: 'Welcome Email',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The subject of the email template.',
        example: 'Welcome to our service!',
    })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({
        description: 'The HTML body of the email template.',
        example: '<h1>Welcome to our service!</h1>',
    })
    @IsString()
    @IsNotEmpty()
    body: string;

    @ApiProperty({
        description: 'The plain text version of the email body.',
        example: 'Welcome to our service!',
        required: false,
    })
    @IsOptional()
    @IsString()
    plainTextBody?: string;

    @ApiProperty({
        description: 'A set of dynamic variables that can be used in the email template.',
        example: '{"firstName": "John", "lastName": "Doe"}',
        required: false,
    })
    @IsOptional()
    @IsJSON()
    variables?: Record<string, any>;

    @ApiProperty({
        description: 'A brief description of the email template.',
        example: 'This template is used for welcoming new users.',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Indicates whether the email template is active.',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        description: 'The language of the email template.',
        example: 'en',
        required: false,
    })
    @IsOptional()
    @IsString()
    language?: string;

    @ApiProperty({
        description: 'A list of tags associated with the template.',
        example: '["welcome", "user", "email"]',
        required: false,
    })
    @IsOptional()
    @IsString()
    tags?: string;
}
