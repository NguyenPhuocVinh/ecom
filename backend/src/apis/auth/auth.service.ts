import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/entities/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from 'src/configs/app.config';
import { UserEntity } from '../users/entities/users.entity';
import * as moment from 'moment-timezone';
import { generateOtp } from 'src/common/function-helper/generate-otp';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_EMITTER } from 'src/common/constants/event-emitter.enum';
// import { MailerService } from '../mailer/mailer.service';
import { MailsService } from '../mails/mails.service';
import { RolesService } from '../roles/roles.service';


const { jwt } = appConfig;

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private eventEmitter: EventEmitter2,
        private readonly mailsService: MailsService,
        private readonly rolesService: RolesService,
    ) { }
    async register(createUserDto: CreateUserDto) {
        const { password, email, role } = createUserDto;
        const isExistUser = await this.usersService.checkUserExist(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!role) {
            const roleUser = await this.rolesService.getRoleUser();
            createUserDto.role = roleUser.id;
        }
        return isExistUser ? Promise.reject(new BadRequestException('USER_EXISTED')) : this.usersService.createUser({ ...createUserDto, password: hashedPassword });
    }

    async login(req: any) {
        const { user } = req;

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(user, { secret: jwt.secret, expiresIn: jwt.expiresIn }),
            this.jwtService.sign(user, { secret: jwt.secret, expiresIn: jwt.refreshExpiresIn }),
        ]);

        // Update refresh token to user
        await this.usersService.updateById(user.id, { refreshToken });
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

    async forgotPassword(email: string) {
        const user = await this.usersService.findOne(email);
        if (!user) throw new BadRequestException('USER_NOT_FOUND');
        const resetPasswordToken = this.jwtService.sign(user, {
            secret: jwt.secret,
            expiresIn: jwt.resetPasswordExpiresIn,
        });
        // await this.mailsService.sendEmailResetPassword(email, resetPasswordToken);
        return true;
    }

    async resetPassword(newPassword: string, req: any) {
        return await this.usersService.resetPassword(newPassword, req);
    }

    async refreshToken(refreshToken: string,) {

        const verifyToken = this.jwtService.verify(refreshToken, { secret: jwt.secret });
        if (!verifyToken) {
            throw new UnauthorizedException('Invalid token');
        }

        const payload = verifyToken.user;
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.sign(payload, { secret: jwt.secret, expiresIn: jwt.expiresIn }),
            this.jwtService.sign(payload, { secret: jwt.secret, expiresIn: jwt.refreshExpiresIn }),
        ]);

        return {
            access_token,
            refresh_token,
        }
    }

}
