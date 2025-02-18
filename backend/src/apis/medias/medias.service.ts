import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class MediasService {
    private readonly logger = new Logger(MediasService.name);
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) { }

    async uploadImage(title: string, file: Express.Multer.File, req: any) {
        const createdBy = req.user;
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path,
                {
                    resource_type: 'auto',
                    folder: 'ecom',
                },
                async (error, result) => {
                    if (error) {
                        this.logger.error('Upload failed', error);
                        reject(error);
                    } else {
                        this.logger.log('Upload successful');
                        try {
                            const media = this.fileRepository.create({
                                ...result,
                                title,
                                createdBy
                            })
                            resolve(await this.fileRepository.save(media));

                            if (file.path) {
                                fs.unlink(file.path, (err) => {
                                    if (err) {
                                        this.logger.error('Error deleting the file', err);
                                    } else {
                                        this.logger.log(`File ${file.path} deleted successfully`);
                                    }
                                });
                            }
                        } catch (err) {
                            this.logger.error('Error saving asset to the database', err);
                            reject(err);
                        }
                    }
                }
            );
        });
    }
}
