import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MailsService } from './mails.service';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';
import { CreateTemplateMailDto } from './entities/dto/create-template-mail.dto';

@Controller('mails')
export class MailsController {
    constructor(
        private readonly mailsService: MailsService,
    ) { }

    @Post()
    @Authorize()
    async create(
        @Body() data: CreateTemplateMailDto,
        @Req() req: any
    ) {
        const createdBy = req.user;
        return await this.mailsService.create(data, createdBy);
    }

    @Get(':id')
    @Authorize()
    async findById(
        @Param('id') id: string
    ) {
        return await this.mailsService.findById(id);
    }
}
