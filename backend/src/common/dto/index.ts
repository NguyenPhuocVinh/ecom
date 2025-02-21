import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class Meta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export class Link {
    first: string;
    last: string;
    prev: string;
    next: string;
}

export class Tag {
    id: number;
    title: string;
}

export class SeoTag {
    @ApiProperty()
    @IsOptional()
    @IsString()
    meta_title: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    meta_description: string;
}

export class FeaturedImage {
    id: number;
    filename: string;
    path: string;
    extension: string;
    mime: string;
    title: string;
    alt: string;
    note: string;
    short_description: string;
}

export class Reply {
    @ApiProperty()
    @IsString()
    reply_subject: string;

    @ApiProperty()
    @IsString()
    reply_to: string;

    @ApiProperty()
    @IsString()
    reply_body: string;

    @ApiProperty()
    @IsBoolean()
    is_active: boolean;
}

export class Notification extends PartialType(Reply) { }
