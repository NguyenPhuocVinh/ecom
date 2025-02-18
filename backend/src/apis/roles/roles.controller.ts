import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './entities/dto/create-role.dto';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
    ) { }

    @Post()
    async create(
        @Body() createRoleDto: CreateRoleDto,
    ) {
        return await this.rolesService.create(createRoleDto);
    }

    @Get()
    async getAll() {
        return await this.rolesService.getAll();
    }
}
