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
import { TenantsModule } from './apis/tenants/tenants.module';
import { AuthModule } from './apis/auth/auth.module';
const { db } = appConfig;
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
    UsersModule,
    PermissionsModule,
    RolesModule,
    MediasModule,
    TenantsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
