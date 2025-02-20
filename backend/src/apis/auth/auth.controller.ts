import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/entities/dto/create-user.dto';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiProperty } from '@nestjs/swagger';
import { UserLoginDto } from '../users/entities/dto/login.dto';
import { Authorize, AuthorizeResetPassWord } from 'src/cores/decorators/auth/authorization.decorator';
import { Tenant } from 'src/cores/decorators/tenant.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiHeader({
        name: 'x-tenant-id',
        description: 'Tenant ID for multi-tenant authentication, example: e438b3e4-507b-49e0-b5a9-2f6d4e740648',
        required: true,
    })
    @ApiBody({
        description: 'User credentials',
        type: UserLoginDto,
    })
    async login(
        @Req() req: any,
    ) {
        return this.authService.login(req);
    }

    @Post('forgot-password')
    @ApiHeader({
        name: 'x-tenant-id',
        description: 'Tenant ID for multi-tenant authentication, example: e438b3e4-507b-49e0-b5a9-2f6d4e740648',
        required: true,
    })
    async forgotPassword(
        @Body('email') email: string,
        @Tenant() tenant: string,
    ) {
        return this.authService.forgotPassword(email, tenant);
    }

    @Post('reset-password')
    @AuthorizeResetPassWord()
    @ApiBearerAuth()
    @ApiBody({
        description: 'New password',
        type: String,
    })
    async resetPassword(
        @Req() req: any,
        @Body('newPassword') newPassword: string,
    ) {
        return this.authService.resetPassword(newPassword, req);
    }

    @Post('refresh-token')
    async refreshToken(
        @Tenant() tenant: string,
        @Body('refresh_token') refreshToken: string,
    ) {
        return await this.authService.refreshToken(refreshToken);
    }
}
