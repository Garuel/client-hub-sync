import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PreRegisterDto } from "./dto/pre-register.dto";
import { ResponseAPI } from "src/core/domain/interfaces/response-api.interface";
import { RefreshTokenDto } from "./dto/refresh.dto";
import { AuthTokensInterface } from "./interfaces/tokens.interface";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("pre-register")
    @HttpCode(HttpStatus.OK)
    async preRegister(@Body() preRegisterDto: PreRegisterDto): Promise<ResponseAPI<string>> {
        return this.authService.preRegister(preRegisterDto);
    }

    @Post("register")
    @HttpCode(HttpStatus.OK)
    async register(@Body() registerDto: RegisterDto): Promise<ResponseAPI> {
        return this.authService.register(registerDto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Ip() ip: string
    ): Promise<ResponseAPI<AuthTokensInterface>> {
        return this.authService.login(loginDto, ip);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @Body() dto: RefreshTokenDto,
        @Ip() ip: string,
    ): Promise<ResponseAPI<AuthTokensInterface>> {
        return this.authService.refreshToken(dto, ip);
    }
}
