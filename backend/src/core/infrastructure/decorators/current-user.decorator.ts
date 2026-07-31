
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioInfoToken } from 'src/modules/auth/dto/login.dto';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UsuarioInfoToken => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
