import { Injectable } from '@nestjs/common';
import { ClienteRepository } from 'src/core/database/repositories/core/cliente/cliente.repository';
import { ObtenerClientesDto, ObtenerClientesResponse } from './dto/obtener-clientes.dto';
import { ClienteFiltros } from 'src/core/domain/interfaces/repositories/cliente-filtros.interface';
import { ClienteMapper } from './mapper/cliente.mapper';
import { IPaginatedResponse } from 'src/core/domain/interfaces/listados.interface';

@Injectable()
export class ConsultaMigracionService {
  constructor(private readonly clienteRepository: ClienteRepository) { }

  async obtenerClientes(dto: ObtenerClientesDto): Promise<IPaginatedResponse<ObtenerClientesResponse>> {
    const limit = dto.limit ?? 3;
    const page = dto.page ?? 1;

    const filtros: ClienteFiltros = {
      search: dto.search,
      activo: dto.active,
      migrado: dto.migrado,
      offset: dto.offset,
      limit,
    };

    const [clientes, total] = await this.clienteRepository.findPaginado(filtros);
    const dataMapeada = ClienteMapper.toResponse(clientes);
    return {
      success: true,
      data: dataMapeada,
      meta: {
        totalItems: total,
        itemCount: dataMapeada.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    }
  }
}