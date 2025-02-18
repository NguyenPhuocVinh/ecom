import { Body, Controller, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionsDto } from './entities/dto/create-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('permissions')
@ApiTags('permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService,
    ) { }
    @Post()
    async create(
        @Body() createPermissionsDto: CreatePermissionsDto,
    ) {
        return await this.permissionsService.create(createPermissionsDto);
    }
}
