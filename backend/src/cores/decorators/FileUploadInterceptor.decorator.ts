import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";

export function FileUploadInterceptor(fieldName: string) {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: multer.diskStorage({
                    destination: './upload',
                    filename: (req, file, cb) => {
                        const filename = `${Date.now()}-${file.originalname}`;
                        cb(null, filename);
                    },
                }),
            }),
        ),
    );
}

export function FilesUploadInterceptor(fieldName: string, maxCount: number) {
    return applyDecorators(
        UseInterceptors(
            FilesInterceptor(fieldName, maxCount, {
                storage: multer.diskStorage({
                    destination: './upload',
                    filename: (req, file, cb) => {
                        const filename = `${Date.now()}-${file.originalname}`;
                        cb(null, filename);
                    },
                }),
            }),
        ),
    );
}
