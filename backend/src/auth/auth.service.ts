import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

import { Users } from "src/users/entities/users.entity";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { JwtPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
    constructor(
        // private readonly usersService: UsersService,
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async registrar(user: RegisterDto) {
        const { nombres, username, password } = user

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepository.create({
            nombres,
            username,
            password: hashedPassword,
            rol: user.rol,
        });

        await this.usersRepository.save(newUser);

        const token = await this.generateTokens(newUser);
        await this.updateRefreshToken(newUser.id, token.refreshToken);

        return {
            user: {
                id: newUser.id,
                nombres: newUser.nombres,
                username: newUser.username,
                rol: newUser.rol,
            },
            ...token
        }
    }

    async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        nombres: user.nombres,
        username: user.username,
        rol: user.rol,
      },
      ...tokens,
    };
  }

    async logout(userId: string) {
        await this.usersRepository.update(userId, { refreshToken: null! });
        return { message: 'Sesión cerrada exitosamente' };
    }

    async refreshTokens(userId: string) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Acceso denegado');
        }

        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    private async generateTokens(user: Users) {
        const payload: JwtPayload = {
            userId: user.id,
            username: user.username,
            roles: user.rol,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRATION'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(userId, { refreshToken: hashedRefreshToken });
    }

}