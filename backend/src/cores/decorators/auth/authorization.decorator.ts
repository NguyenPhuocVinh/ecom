import { applyDecorators, UseGuards } from "@nestjs/common";
import { Permissions } from "./permission.decorator";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { JwtResetPasswordGuard } from "src/cores/guards/jwt-resetPassword.guard";
import { JwtAnonymousGuard } from "src/cores/guards/jwt-anonymous.guard";

export const Authorize = (...args: string[]) => {
    return applyDecorators(
        // Permissions(...args),
        UseGuards(
            JwtAuthGuard,
            // PermissionsGuard
        ),
    );
};

export const AuthorizeGuest = (...args: string[]) => {
    return applyDecorators(
        // Permissions(...args),
        UseGuards(
            JwtAnonymousGuard,
            // PermissionsGuard
        ),
    );
}

export const AuthorizeResetPassWord = (...args: string[]) => {
    return applyDecorators(
        UseGuards(
            JwtResetPasswordGuard,
        ),
    );
};