import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './entities/dto/create-tenant.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('tenants')
export class TenantsController {
    constructor(
        private readonly tenantsService: TenantsService,
    ) { }

    @Post()
    @ApiBody({
        description: 'Tenant information',
        type: CreateTenantDto,
    })
    async create(
        @Body() createTenantDto: CreateTenantDto,
    ) {
        return this.tenantsService.create(createTenantDto);
    }

    @Get()
    async getAll() {
        return this.tenantsService.getAll();
    }
}
