import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MediasService } from './medias.service';
import { FilesUploadInterceptor, FileUploadInterceptor } from 'src/cores/decorators/FileUploadInterceptor.decorator';
import { TYPE_FILE } from 'src/common/constants/enum';
import { Authorize } from 'src/cores/decorators/auth/authorization.decorator';

@Controller('medias')
export class MediasController {
    constructor(private readonly mediaService: MediasService) { }

    @Post('upload-single')
    @Authorize()
    @FileUploadInterceptor(TYPE_FILE.IMAGE)
    uploadSingle(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // Max 5MB
                    new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body('title') title: string,
        @Req() req: any,
    ) {
        return this.mediaService.uploadImage(title, file, req);
    }

    @Post('upload-multiple')
    @Authorize()
    @FilesUploadInterceptor(TYPE_FILE.IMAGE, 10)
    uploadMultipe(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ }),
                ],
            }),
        )
        files: Express.Multer.File[],
        @Body('title') title: string,
        @Req() req: any,
    ) {
        console.log("🚀 ~ MediasController ~ files:", files)
        return this.mediaService.uploadImages(title, files, req);
    }

}
