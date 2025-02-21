import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './entities/dto/create-role.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheManagerService } from 'src/cores/cache-manager/cache-manager.service';
import { ENTITY_NAME } from 'src/common/constants/enum';

@Controller('roles')
export class RolesController {
    private readonly logger = new Logger(RolesController.name)
    constructor(
        private readonly rolesService: RolesService,
        private readonly cacheManagerService: CacheManagerService,
    ) { }

    @Post()
    async create(
        @Body() createRoleDto: CreateRoleDto,
    ) {
        return await this.rolesService.create(createRoleDto);
    }

    @Get()
    async getAll() {
        const key = await this.cacheManagerService.generateCacheKeyForFindAll(
            ENTITY_NAME.ROLES,
            'getAll',
            {},
            'en',
        )
        const cacheData = await this.cacheManagerService.getCache(key);
        if (cacheData) {
            return cacheData;
        }
        const roles = await this.rolesService.getAll();
        await this.cacheManagerService.setCache(key, roles);
        return roles;
    }
}
