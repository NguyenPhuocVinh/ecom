import { applyDecorators, UseGuards } from "@nestjs/common";
import { Permissions } from "./permission.decorator";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";

export const Authorize = (...args: string[]) => {
    return applyDecorators(
        // Permissions(...args),
        UseGuards(
            JwtAuthGuard,
            // PermissionsGuard
        ),
    );
};
