import 'dotenv/config';

export const appConfig = {
    appName: process.env.APP_NAME,
    locale: process.env.LOCALE,
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
        resetPasswordExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
    cloudinarySetting: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    email: {
        host: process.env.HOST_EMAIL,
        port: parseInt(process.env.HOST_EMAIL_PORT),
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
        user: process.env.GOOGLE_EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    },
    tomtom: {
        apiKey: process.env.TOMTOM_API_KEY,
        url: process.env.TOMTOM_URL,
        version: process.env.TOMTOM_VERSION,
    },

    vnpay: {
        vnp_TmnCode: process.env.VNP_TMN_CODE,
        vnp_HashSecret: process.env.VNP_HASH_SECRET,
        vnp_Url: process.env.VNP_URL,
        vnp_ReturnUrl: process.env.VNP_RETURN_URL,
        vnp_Api: process.env.VNP_API,
        vnp_Currency: process.env.VNP_CURRENCY
    },

    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publicKey: process.env.STRIPE_PUBLIC_KEY,
    }

}

// Add validation
if (!appConfig.db.database) {
    throw new Error('Database name is not configured. Please check your .env file.');
}

