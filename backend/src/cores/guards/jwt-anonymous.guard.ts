import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAnonymousGuard extends AuthGuard('jwt-anonymous') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (token) {
            if (this.isTokenExpired(token)) {
                throw new UnauthorizedException('Token has expired');
            }
        } else {
            return true;
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