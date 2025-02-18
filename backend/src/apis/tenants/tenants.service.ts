import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenants.entity';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './entities/dto/create-tenant.dto';

@Injectable()
export class TenantsService {
    private readonly logger = new Logger(TenantsService.name);
    constructor(
        @InjectRepository(TenantEntity)
        private readonly tenantRepository: Repository<TenantEntity>
    ) { }

    async create(createTenantDto: CreateTenantDto) {
        const tenant = this.tenantRepository.create({
            ...createTenantDto,
            logo: { id: createTenantDto.logo }
        });
        await this.tenantRepository.save(tenant);
        return tenant;
    }
}
