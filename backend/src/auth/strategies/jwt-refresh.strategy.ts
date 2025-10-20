import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import * as bcrypt from 'bcrypt';


import { Users } from "src/users/entities/users.entity";
import { JwtPayload } from "./jwt.strategy";


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: JwtPayload): Promise<Users> {
        const refreshToken = req.body.refreshToken;
        const user = await this.userRepository.findOne({ where: { id: payload.userId } });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Token de refresco inválido');
        }

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            throw new UnauthorizedException('Token de refresco inválido');
        }

        return user;
    }
}