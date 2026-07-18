import { Injectable } from '@nestjs/common';
import { ClienteRepository } from 'src/core/database/repositories/core/cliente/cliente.repository';
import { ClienteFiltros } from 'src/core/domain/interfaces/repositories/cliente-filtros.interface';
import { ObtenerClientesDto, ObtenerClientesResponse } from './dto/obtener-clientes.dto';
import { ClienteMapper } from './mapper/cliente.mapper';
import { IServicePaginatedResult } from 'src/core/domain/interfaces/service-response.interface';

@Injectable()
export class ConsultaMigracionService {
  constructor(private readonly clienteRepository: ClienteRepository) { }

  async obtenerClientes(dto: ObtenerClientesDto): Promise<IServicePaginatedResult<ObtenerClientesResponse>> {
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
      results: dataMapeada,
      pagination: {
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
      }
    }
  }
}