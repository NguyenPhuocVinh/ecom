import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { RolesService } from 'src/apis/roles/roles.service';
import { appConfig } from 'src/configs/app.config';

const { jwt } = appConfig;

@Injectable()
export class JwtResetPassWordStrategy extends PassportStrategy(Strategy, 'jwt-resetPassword') {
    constructor(
        private readonly roleService: RolesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt.secret,
        });
    }

    async validate(payload: any) {
        // const { role } = payload;
        // const RoleEntity = await this.roleService.getRoleById(role.id);
        // const permissions = RoleEntity.permissions.map(permission => permission.name);
        // payload.permissions = permissions;
        return { ...payload };
    }
}
