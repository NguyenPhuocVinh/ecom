
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/apis/auth/auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import * as _ from 'lodash';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private moduleRef: ModuleRef) {
        super(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            }
        );
    }

    async validate(
        request: Request,
        email: string,
        password: string,
    ): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        // const tenantId = request.headers['x-tenant-id'];
        // if (!tenantId) throw new UnauthorizedException('Missing tenant id in header');
        const authService = await this.moduleRef.resolve(AuthService, contextId);
        let user = await authService.validateUser(email, password);
        user = await authService.processLogin(user);
        if (!user) throw new UnauthorizedException();
        return _.pick(user, [
            'id',
            'lastName',
            'firstName',
            'email',
            'role.id',
            // 'tenants',
            'activeLogin',
            'lastLoginVer',
        ]);
    }
}
