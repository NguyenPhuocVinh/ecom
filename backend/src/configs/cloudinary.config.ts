import { v2 as cloudinary } from 'cloudinary';
import { appConfig } from './app.config';

export const CLOUDINARY = 'CLOUDINARY';
const { cloudinarySetting } = appConfig

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
        cloudinary.config({
            cloud_name: cloudinarySetting.cloud_name,
            api_key: cloudinarySetting.api_key,
            api_secret: cloudinarySetting.api_secret,
        });
        return cloudinary;
    },
};
