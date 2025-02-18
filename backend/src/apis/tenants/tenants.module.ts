import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantEntity
    ])
  ],
  providers: [TenantsService],
  controllers: [TenantsController]
})
export class TenantsModule { }
