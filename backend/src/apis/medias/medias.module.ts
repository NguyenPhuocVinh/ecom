import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/media.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryProvider } from 'src/configs/cloudinary.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileEntity
    ]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
  ],
  providers: [
    MediasService,
    CloudinaryProvider
  ],
  controllers: [MediasController]
})
export class MediasModule { }
