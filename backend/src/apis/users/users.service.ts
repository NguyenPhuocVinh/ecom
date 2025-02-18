import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './entities/dto/create-user.dto';
import _ from 'lodash';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }
    async checkUserExist(email: string) {
        const user = await this.userRepository.count({ where: { email } });
        return !!user;
    }
    async createUser(createUserDto: CreateUserDto) {
        const user = this.userRepository.create({
            ...createUserDto,
            role: { id: createUserDto.role } as any,
        });
        await this.userRepository.save(user);
        return user;
    }

    async findOne(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async updateById(id: string, data: Partial<UserEntity>) {
        await this.userRepository.update(id, data);
        return await this.userRepository.findOne({ where: { id }, relations: ['role'] });
    }
}
