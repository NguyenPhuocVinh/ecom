import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as jwt from 'jsonwebtoken';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


@Injectable()
export class JwtResetPasswordGuard extends AuthGuard('jwt-resetPassword') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (token && this.isTokenExpired(token)) {
            throw new UnauthorizedException('Token has expired');
        }

        return super.canActivate(context);
    }

    private extractToken(request: any): string | null {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return null;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwt.decode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    }
}

