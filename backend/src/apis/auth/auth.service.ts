import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/entities/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from 'src/configs/app.config';
import { UserEntity } from '../users/entities/users.entity';
import * as moment from 'moment-timezone';


const { jwt } = appConfig;

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }
    async register(createUserDto: CreateUserDto) {
        const { password, email } = createUserDto;
        const isExistUser = await this.usersService.checkUserExist(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        return isExistUser ? Promise.reject(new BadRequestException('USER_EXISTED')) : this.usersService.createUser({ ...createUserDto, password: hashedPassword });
    }

    async login(req: any) {
        const { user } = req;
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(user, { secret: jwt.secret, expiresIn: jwt.expiresIn }),
            this.jwtService.sign(user, { secret: jwt.secret, expiresIn: jwt.refreshExpiresIn }),
        ]);
        return {
            accessToken,
            refreshToken,
            user,
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        const isMatch = await bcrypt.compare(password, user.password);
        if (user && isMatch) {
            return user;
        }
        return null;
    }

    async processLogin(user: Partial<UserEntity>) {
        user.lastLoginVer = moment().format('YYYY-MM-DD HH:mm:ss');
        const activeLogin = _.takeRight(
            _.uniq([...user.activeLogin, user.lastLoginVer]),
            10,
        );
        const result = await this.usersService.updateById(user.id, { lastLoginVer: user.lastLoginVer, activeLogin });
        return result;
    }

    async forgotPassword() { }
}
