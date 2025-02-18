import 'dotenv/config';

export const appConfig = {
    db: {
        type: process.env.DB_TYPE as any || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: String(process.env.DB_PASSWORD),
        database: process.env.DB_DATABASE,
        entities: [
            process.env.NODE_ENV === 'production'
                ? 'dist/apis/**/*.entity{.ts,.js}'
                : 'src/apis/**/*.entity{.ts,.js}'
        ],
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    cloudinarySetting: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
}

