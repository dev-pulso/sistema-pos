export interface JwtPayload {
    userId: string;
    username: string;
    roles: Rols;
}
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";

import { Strategy, ExtractJwt } from "passport-jwt";
import { Repository } from "typeorm";


import { Rols, Users } from "src/users/entities/users.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }
    async validate(payload: JwtPayload): Promise<Users> {
        const { userId } = payload

        const user = await this.userRepository.findOne({ where: { id: userId, isActive: true } });
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado o inactivo');
        }
        return user;
    }

}