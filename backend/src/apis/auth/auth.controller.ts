import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/entities/dto/create-user.dto';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { UserLoginDto } from '../users/entities/dto/login.dto';

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
    @ApiBody({
        description: 'User credentials',
        type: UserLoginDto,
    })
    async login(
        @Req() req: any,
    ) {
        return this.authService.login(req);
    }
}
