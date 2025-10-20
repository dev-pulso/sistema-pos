import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles, RolesGuard } from "src/guard/roles.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @Post('register')
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles('superadmin')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.registrar(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    refresh(@Req() req) {
        return this.authService.refreshTokens(req.user.id);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    logout(@Req() req) {
        return this.authService.logout(req.user.id);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req) {
        return req.user;
    }

    @Get('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'superadmin')
    adminOnly() {
        return { message: 'Acceso de administrador concedido' };
    }

}