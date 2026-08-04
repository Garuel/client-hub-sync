import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PreRegisterDto } from "./dto/pre-register.dto";
import { RefreshTokenDto } from "./dto/refresh.dto";
import { AuthTokensDto } from "./dto/tokens.dto";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiExtraModels, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ResponseApiDto } from "src/core/domain/classes/base-response-api.class";
import { ApiResponseWithData, ApiResponseWithoutData, ApiResponseWithPrimitive } from "src/core/infrastructure/decorators/api-response.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("pre-register")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Pre register por email de usuario' })
    @ApiResponseWithPrimitive('string')
    async preRegister(@Body() preRegisterDto: PreRegisterDto): Promise<ResponseApiDto<string>> {
        return this.authService.preRegister(preRegisterDto);
    }

    @Post("register")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar usuario' })
    @ApiResponseWithoutData()
    async register(@Body() registerDto: RegisterDto): Promise<ResponseApiDto<{}>> {
        return this.authService.register(registerDto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login de usuario' })
    @ApiResponseWithData(AuthTokensDto)
    async login(
        @Body() loginDto: LoginDto,
        @Ip() ip: string
    ): Promise<ResponseApiDto<AuthTokensDto>> {
        return this.authService.login(loginDto, ip);
    }


    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar usuario' })
    @ApiResponseWithData(AuthTokensDto)
    async refreshToken(
        @Body() dto: RefreshTokenDto,
        @Ip() ip: string,
    ): Promise<ResponseApiDto<AuthTokensDto>> {
        return this.authService.refreshToken(dto, ip);
    }
}
