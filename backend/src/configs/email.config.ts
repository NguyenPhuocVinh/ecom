import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { appConfig } from './app.config';

const { email } = appConfig;
const o2Auth2Client = new google.auth.OAuth2(
    email.googleId,
    email.clientSecret,
    email.redirectUri
);

o2Auth2Client.setCredentials({ refresh_token: email.refreshToken });

async function getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        o2Auth2Client.getAccessToken((err, token) => {
            if (err) {
                console.error('Error while fetching access token: ', err);
                reject(new Error('Failed to create access token'));
            } else {
                resolve(token);
            }
        });
    });
}

export async function createTransporter(): Promise<nodemailer.Transporter> {
    try {
        const accessToken = await getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.HOST_EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken,
            },
        });
        return transporter;
    } catch (error) {
        console.error('Failed to create transporter: ', error);
        throw error;
    }
}
