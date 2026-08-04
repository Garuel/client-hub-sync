import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioInfoToken } from 'src/modules/auth/dto/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') ?? 'JWT_SECRET',
        });
    }

    async validate(payload: UsuarioInfoToken) {
        if (!payload.id || !payload.idEstado) {
            throw new UnauthorizedException('Token inválido o malformado.');
        }

        return payload;
    }
}