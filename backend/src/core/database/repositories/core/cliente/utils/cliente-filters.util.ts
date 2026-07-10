import { isNotEmpty } from 'class-validator';
import { ClienteFiltros } from 'src/core/domain/interfaces/repositories/cliente-filtros.interface';

export namespace ClienteFilters {
  export function getFilters(filtros: ClienteFiltros) {
    let filters = '';
    if (isNotEmpty(filtros.search)) {
      filters += ' AND cliente.nombreCompleto ILIKE :search';
    }

    if (filtros.activo) {
      filters += ' AND cliente.activo = :activo';
    }

    if (filtros.migrado) {
      filters += ' AND cliente.migrado = :migrado';
    }

    return filters.length > 0 ? filters.substring(5) : filters;
  }
}
