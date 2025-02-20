import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { appConfig } from 'src/configs/app.config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: Transporter;
    private readonly logger = new Logger(MailerService.name);
    private readonly oAuth2Client = new google.auth.OAuth2(
        appConfig.email.clientId,
        appConfig.email.clientSecret,
        appConfig.email.redirectUri,
    );

    constructor() {
        this.oAuth2Client.setCredentials({
            refresh_token: appConfig.email.refreshToken,
        });
        this.initializeTransporter();
    }

    private async initializeTransporter() {
        try {
            const accessToken = await this.getAccessToken();
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: appConfig.email.user,
                    clientId: appConfig.email.clientId,
                    clientSecret: appConfig.email.clientSecret,
                    refreshToken: appConfig.email.refreshToken,
                    accessToken: accessToken,
                },
            });
            this.logger.log('Email transporter created successfully');
        } catch (error) {
            this.logger.error('Failed to create email transporter', error);
            throw error;
        }
    }

    private async getAccessToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.oAuth2Client.getAccessToken((err, token) => {
                if (err) {
                    this.logger.error('Error while fetching access token', err);
                    return reject(new Error('Failed to create access token'));
                }
                resolve(token as string);
            });
        });
    }

    async sendMail(options: nodemailer.SendMailOptions): Promise<any> {
        try {
            return await this.transporter.sendMail(options);
        } catch (error) {
            this.logger.error('Error sending email', error);
            throw error;
        }
    }
}
