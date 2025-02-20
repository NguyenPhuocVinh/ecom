import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/configs/app.config';
import { LocalStrategy } from 'src/cores/strategy/local.strategy';
import { JwtStrategy } from 'src/cores/strategy/jwt.strategy';
import { RolesModule } from '../roles/roles.module';
import { MailsModule } from '../mails/mails.module';
import { JwtResetPasswordGuard } from 'src/cores/guards/jwt-resetPassword.guard';
import { JwtResetPassWordStrategy } from 'src/cores/strategy/jwt-resetPassword.strategy';
const { jwt } = appConfig
@Module({
  imports: [
    JwtModule.register({
      secret: jwt.secret,
      signOptions: { expiresIn: jwt.expiresIn }
    }),
    UsersModule,
    RolesModule,
    MailsModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtResetPassWordStrategy
  ],
})
export class AuthModule { }
