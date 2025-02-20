import { Module } from '@nestjs/common';
import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateMailEntity } from './entities/template-mails.entity';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TemplateMailEntity
    ]),
    MailerModule
  ],
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService]
})
export class MailsModule { }
