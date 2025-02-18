import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateMailEntity } from './entities/template-mails.entity';
import { Repository } from 'typeorm';
import { CreateTemplateMailDto } from './entities/dto/create-template-mail.dto';
import { BaseService } from 'src/cores/services/repository.service';
import { MailerService } from '../mailer/mailer.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EVENT_EMITTER } from 'src/common/constants/event-emitter.enum';

@Injectable()
export class MailsService {
    private readonly logger = new Logger(MailsService.name);
    constructor(
        @InjectRepository(TemplateMailEntity)
        private readonly templateMailRepository: Repository<TemplateMailEntity>,
        private readonly mailerService: MailerService,
        private eventEmitter: EventEmitter2,
    ) {
    }

    async create(data: CreateTemplateMailDto, createdBy: any) {
        return await this.templateMailRepository.save({
            ...data,
            createdBy
        });
    }

    async findById(id: string) {
        return await this.templateMailRepository.findOne({ where: { id } });
    }

    @OnEvent(EVENT_EMITTER.MAIL.SEND_EMAIL_RESET_PASSWORD)
    async sendEmailResetPassword(templateId: string, to: string) {
        const template = await this.templateMailRepository.findOne({ where: { id: templateId } });
        if (!template) throw new NotFoundException('TEMPLATE_NOT_FOUND');
        return await this.mailerService.sendMail({
            from: process.env.HOST_EMAIL_USER,
            to,
            subject: template.subject,
            html: template.body
        });
    }
}
