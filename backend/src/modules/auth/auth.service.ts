import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsuarioEntity } from 'src/core/database/entities/auth';
import { PreRegisterRepository, UsuarioDatosRepository, UsuarioRefreshTokenRepository, UsuarioRepository } from 'src/core/database/repositories/auth';
import { EstadoUsuarioEnum } from 'src/core/domain/enum/estado-usuario.enum';
import { TipoDocumentoLabel } from 'src/core/domain/enum/tipo-documento.enum';
import { EncryptUtil } from 'src/core/infrastructure/utils/encrypt.util';
import { DataSource } from 'typeorm';
import { LoginDto, UsuarioInfoToken } from './dto/login.dto';
import { PreRegisterDto } from './dto/pre-register.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseApiDto } from 'src/core/domain/classes/base-response-api.class';
import { AuthTokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly preRegisterRepository: PreRegisterRepository,
        private readonly usuarioDatosRepository: UsuarioDatosRepository,
        private readonly usuarioRepository: UsuarioRepository,
        private readonly usuarioRefreshTokenRepository: UsuarioRefreshTokenRepository,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource
    ) { }

    async preRegister(dto: PreRegisterDto): Promise<ResponseApiDto<string>> {
        this.logger.verbose('PRE REGISTER')
        const { email, ip, userAgent } = dto;

        this.logger.log('Verificando si ya existe usuario, llamando usuarios datos repository')
        const usuarioExistente = await this.usuarioDatosRepository.getPorEmail(email);

        if (usuarioExistente) {
            this.logger.log(`Usuario existente: ${usuarioExistente}`)
            throw new ConflictException('El correo electrónico ya se encuentra registrado.');
        }

        this.logger.log('Verificando si ya existe pre registro, llamando pre registro repository')
        const preRegistroExistente = await this.preRegisterRepository.getPorEmail(email);

        if (preRegistroExistente && preRegistroExistente.fechaExpiracion > new Date()) {
            this.logger.log(`Pre registro existente: ${preRegistroExistente}`)
            throw new ConflictException('Ya existe una invitación pendiente enviada a este correo.');
        }

        this.logger.log('Generando token de invitación')
        const tokenInvitacion = EncryptUtil.generateRandomToken()

        this.logger.log('Generando fecha de expiración')
        const fechaExpiracion = new Date();

        this.logger.log('Obteniendo horas de expiración')
        const expireHours = this.configService.get<number>('PRE_REGISTER_EXPIRE_HOURS', 24);

        this.logger.log('Asignando fecha de expiración')
        fechaExpiracion.setHours(fechaExpiracion.getHours() + expireHours);

        this.logger.log('insertando pre register...')
        await this.preRegisterRepository.insert([
            {
                email,
                tokenInvitacion,
                fechaExpiracion,
                completado: false,
                ipCreacion: ip,
                userAgent,
            },
        ]);

        return {
            message: 'Se ha enviado la invitación al correo electrónico proporcionado',
            data: tokenInvitacion,
        };
    }

    async register(dto: RegisterDto): Promise<ResponseApiDto<{}>> {
        this.logger.verbose('REGISTER')

        this.logger.log('Verificando si ya existe pre registro, llamando pre registro repository')
        const preRegistro = await this.preRegisterRepository.getPorToken(dto.tokenPreRegistro);

        if (!preRegistro) {
            this.logger.log(`Pre registro no encontrado: ${preRegistro}`)
            throw new NotFoundException('El token de invitación no es válido.');
        }

        if (preRegistro.completado) {
            throw new BadRequestException('Esta invitación ya ha sido utilizada.');
        }

        if (preRegistro.fechaExpiracion < new Date()) {
            this.logger.log(`Pre registro expirado: ${preRegistro.fechaExpiracion}`)
            throw new BadRequestException('El token de  invitación ha expirado.');
        }

        if (preRegistro.email !== dto.email) {
            this.logger.log(`El correo electrónico no coincide con la invitación enviada: ${preRegistro.email}`)
            throw new BadRequestException('El correo electrónico no coincide con la invitación enviada.');
        }

        this.logger.log('Verificando si ya existe username, llamando usuario repository')
        const existeUsername = await this.usuarioRepository.getPorUsername(dto.username);
        if (existeUsername) {
            this.logger.log(`Username existente: ${existeUsername}`)
            throw new ConflictException('El nombre de usuario ya está en uso.');
        }

        this.logger.log('Generando hash de contraseña')
        const passwordHash = await EncryptUtil.hash(dto.password);

        this.logger.log('Iniciando transacción')
        await this.dataSource.transaction(async (manager) => {
            this.logger.log('Insertando datos personales')
            const insertDatosResult = await this.usuarioDatosRepository.insert([
                {
                    nombres: dto.nombres,
                    apellidoPaterno: dto.apellidoPaterno,
                    apellidoMaterno: dto.apellidoMaterno,
                    numeroDocumento: dto.numeroDocumento,
                    idTipoDocumento: dto.idTipoDocumento,
                    email: dto.email,
                    telefono: dto.numeroTelefono,
                }
            ], manager);

            const idDatosPersonales = insertDatosResult.identifiers[0]?.id;

            if (!idDatosPersonales) {
                throw new InternalServerErrorException('Error al registrar los datos personales.');
            }

            this.logger.log('Insertando usuario')
            await this.usuarioRepository.insert([
                {
                    username: dto.username,
                    password: passwordHash,
                    idEstado: EstadoUsuarioEnum.ACTIVO,
                    idUsuarioDatosPersonales: idDatosPersonales,
                    fechaInicio: new Date(),
                    fechaFin: dto.fechaFinal
                },
            ], manager);

            this.logger.log('Actualizando pre registro')
            await this.preRegisterRepository.actualizar(preRegistro.id, {
                completado: true
            }, manager);
        });

        return {
            message: 'Usuario registrado exitosamente',
        };
    }

    async login(dto: LoginDto, ip: string): Promise<ResponseApiDto<AuthTokensDto>> {
        this.logger.verbose('LOGIN')

        this.logger.log('Valdiando credenciales')
        const usuario = await this.validarCredenciales(dto.username, dto.password);

        this.logger.log('Construyendo payload')
        const payload = this.construirPayloadUsuario(usuario);

        this.logger.log('Generando tokens')
        const tokens = await this.generarTokens(payload);

        this.logger.log('Guardando token de refresco')
        await this.guardarRefreshToken(
            usuario.id,
            tokens.refreshToken,
            ip,
        );

        return {
            message: 'Inicio de sesión exitoso',
            data: tokens,
        };
    }


    private async validarCredenciales(
        username: string,
        passIngresada: string,
    ): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.getPorUsernameConDatosPersonales(username);

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas.');
        }

        if (usuario.idEstado !== EstadoUsuarioEnum.ACTIVO) {
            throw new UnauthorizedException('El usuario no se encuentra activo.');
        }

        const esPasswordValida = await EncryptUtil.compare(passIngresada, usuario.password);
        if (!esPasswordValida) {
            throw new UnauthorizedException('Credenciales inválidas.');
        }

        return usuario;
    }


    private construirPayloadUsuario(usuario: UsuarioEntity): UsuarioInfoToken {
        const datos = usuario.usuarioDatosPersonalesEntity;

        return {
            id: usuario.id,
            username: usuario.username,
            idEstado: usuario.idEstado,
            email: datos?.email ?? '',
            nombres: datos?.nombres ?? '',
            apellidoPaterno: datos?.apellidoPaterno ?? '',
            apellidoMaterno: datos?.apellidoMaterno,
            numeroDocumento: datos?.numeroDocumento ?? '',
            idTipoDocumento: datos?.idTipoDocumento ?? 0,
            abreviaturaTipoDocumento: datos?.idTipoDocumento
                ? (TipoDocumentoLabel[datos.idTipoDocumento] ?? '')
                : '',
        };
    }


    private async generarTokens(payload: UsuarioInfoToken): Promise<AuthTokensDto> {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: jwtSecret,
                expiresIn: this.configService.get<any>('JWT_EXPIRES_IN', '15m'),
            }),
            this.jwtService.signAsync(
                { idUsuario: payload.id },
                {
                    secret: refreshSecret,
                    expiresIn: this.configService.get<any>('JWT_REFRESH_EXPIRES_IN', '7d'),
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }


    private async guardarRefreshToken(
        idUsuario: number,
        refreshTokenRaw: string,
        ip?: string,
    ): Promise<void> {
        const refreshTokenHash = EncryptUtil.hashToken(refreshTokenRaw);

        const diasExpiracion = this.configService.get<number>('REFRESH_TOKEN_EXPIRE_DAYS', 7);
        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + diasExpiracion);

        await this.usuarioRefreshTokenRepository.insert([
            {
                idUsuario,
                refreshToken: refreshTokenHash,
                fechaExpiracion,
                revocado: false,
                ipCreacion: ip,
            },
        ]);
    }



    async refreshToken(dto: RefreshTokenDto, ip?: string): Promise<ResponseApiDto<AuthTokensDto>> {
        const payloadRefresh = this.verificarRefreshTokenJwt(dto.oldRefreshToken);

        const tokenHash = EncryptUtil.hashToken(dto.oldRefreshToken);

        const tokenBD = await this.usuarioRefreshTokenRepository.getPorTokenHash(tokenHash);

        if (!tokenBD || tokenBD.revocado || tokenBD.fechaExpiracion < new Date()) {
            throw new UnauthorizedException('El Refresh Token no es válido o ha sido revocado.');
        }



        const usuario = await this.usuarioRepository.getPorId(payloadRefresh.idUsuario);
        if (!usuario || usuario.idEstado !== EstadoUsuarioEnum.ACTIVO) {
            throw new UnauthorizedException('El usuario no existe o se encuentra inactivo.');
        }
        await this.usuarioRefreshTokenRepository.update(tokenBD.id, { revocado: true });

        const nuevosPayload = this.construirPayloadUsuario(usuario);
        const nuevosTokens = await this.generarTokens(nuevosPayload);

        await this.guardarRefreshToken(usuario.id, nuevosTokens.refreshToken, ip);

        return {
            message: 'Token renovado con éxito',
            data: nuevosTokens,
        };
    }


    private verificarRefreshTokenJwt(token: string): { idUsuario: number } {
        try {
            const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
            return this.jwtService.verify<{ idUsuario: number }>(token, { secret });
        } catch {
            throw new UnauthorizedException('El Refresh Token ha expirado o es inválido.');
        }
    }
}