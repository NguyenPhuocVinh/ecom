import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/roles.entity';
import { CreateRoleDto } from './entities/dto/create-role.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name);
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>
    ) { }

    async create(createRoleDto: CreateRoleDto) {
        const role = this.roleRepository.create({
            ...createRoleDto,
            permissions: createRoleDto.permissions
                ? createRoleDto.permissions.map(permissionId => ({ id: permissionId } as any))
                : [],
        });
        await this.roleRepository.save(role);
        return role;
    }

    async getAll() {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async getRoleById(id: string) {
        return this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    }

    async getRoleUser() {
        return this.roleRepository.findOne({ where: { isDefault: true } });
    }
}
