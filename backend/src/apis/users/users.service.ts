import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './entities/dto/create-user.dto';
import _ from 'lodash';
import { OtpEntity } from './entities/otp.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(OtpEntity)
        private readonly otpRepository: Repository<OtpEntity>,
    ) { }
    async checkUserExist(email: string, tenant?: string) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.tenants', 'tenant')
            .where('user.email = :email', { email })
            .andWhere('tenant.id = :tenantId', { tenantId: tenant })
            .getCount();
        return !!user;
    }
    async createUser(createUserDto: CreateUserDto) {
        const user = this.userRepository.create({
            ...createUserDto,
            tenants: [{ id: createUserDto.tenant }],
            role: { id: createUserDto.role } as any,
        });
        await this.userRepository.save(user);
        return user;
    }

    async findOne(email: string, tenant?: string) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.tenants', 'tenant')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.email = :email', { email })
            .andWhere('tenant.id = :tenantId', { tenantId: tenant })
            .getOne();
        return user;
    }

    async updateById(id: string, data: Partial<UserEntity>) {
        await this.userRepository.update(id, data);
        return await this.userRepository.findOne({ where: { id }, relations: ['role', 'tenants'] });
    }

    async forgotPassword(email: string, otp: string, req: any) {

        const user = await this.findOne(email);
        if (!user) throw new BadRequestException('USER_NOT_FOUND');
        const foundOtp = await this.otpRepository.findOne({ where: { user: { id: user.id } } });
        if (foundOtp) {
            await this.otpRepository.update(foundOtp.id, { otp });
            return foundOtp;
        }
        const newOtp = await this.otpRepository.create({ otp, user });
        await this.otpRepository.save(newOtp);
        return newOtp;
    }

    async resetPassword(newPassword: string, req: any) {
        const { email, tenants } = req.user;
        const user = await this.findOne(email, tenants[0]);
        if (!user) throw new BadRequestException('USER_NOT_FOUND');
        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) throw new BadRequestException('PASSWORD_IS_SAME');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.updateById(user.id, { password: hashedPassword });
        return { message: 'Reset password successfully' };
    }
}
