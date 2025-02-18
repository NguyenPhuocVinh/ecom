import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionsDto } from './entities/dto/create-permission.dto';

@Injectable()
export class PermissionsService {
    private readonly logger = new Logger(PermissionsService.name);
    constructor(
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,
    ) { }
    async create(createPermissionsDto: CreatePermissionsDto) {
        const { name, entityName } = createPermissionsDto;


        const permissionParams = [
            'admin.###.index',
            'admin.###.create',
            'admin.###.edit',
            'admin.###.destroy',
        ];

        const resultArray = permissionParams.map((item) => ({
            name: item.replace('###', name),
            entityName,
        }));

        return await this.permissionRepository.save(resultArray);
    }
}
