import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { appConfig } from "src/configs/app.config";

@Injectable()
export class JwtAnonymousStrategy extends PassportStrategy(Strategy, 'jwt-anonymous') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig.jwt.secret,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const token = this.extractToken(req);

        if (token) {
            if (this.isTokenExpired(payload)) {
                throw new UnauthorizedException("Token has expired");
            }
            return payload; // Trả về thông tin user nếu token hợp lệ
        }

        return null; // Không có token, cho phép truy cập với tư cách khách
    }

    private extractToken(request: Request): string | null {
        const authHeader = request.headers.authorization;
        return authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    }

    private isTokenExpired(payload: any): boolean {
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    }
}
