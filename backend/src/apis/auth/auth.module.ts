import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/configs/app.config';
import { LocalStrategy } from 'src/cores/strategy/local.strategy';
import { JwtStrategy } from 'src/cores/strategy/jwt.strategy';
import { RolesModule } from '../roles/roles.module';
const { jwt } = appConfig
@Module({
  imports: [
    JwtModule.register({
      secret: jwt.secret,
      signOptions: { expiresIn: jwt.expiresIn }
    }),
    UsersModule,
    RolesModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AuthModule { }
