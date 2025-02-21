import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './configs/app.config';
import { UsersModule } from './apis/users/users.module';
import { PermissionsModule } from './apis/permissions/permissions.module';
import { RolesModule } from './apis/roles/roles.module';
import { MediasModule } from './apis/medias/medias.module';
import { AuthModule } from './apis/auth/auth.module';
import { MailsModule } from './apis/mails/mails.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { CacheManagerModule } from './cores/cache-manager/cache-manager.module';
import { CategoriesModule } from './apis/categories/categories.module';


const { db, redis } = appConfig;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: db.type,
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        database: db.database,
        entities: db.entities,
        synchronize: true,
      })
    }),
    // BullModule.forRootAsync({
    //   useFactory: () => ({
    //     redis: {
    //       host: redis.host,
    //       port: redis.port,
    //       password: redis.password,
    //     },
    //     prefix: appConfig.appName,
    //     defaultJobOptions: {
    //       removeOnComplete: true,
    //     },
    //   }),
    // }),
    EventEmitterModule.forRoot(),
    UsersModule,
    PermissionsModule,
    RolesModule,
    MediasModule,
    AuthModule,
    MailsModule,
    CategoriesModule,
    CacheManagerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
