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

    if (filtros.migrado === true) {
      filters += ' AND clienteMigracion.id IS NOT NULL';
    } else if (filtros.migrado === false) {
      filters += ' AND clienteMigracion.id IS NULL';
    }

    return filters.length > 0 ? filters.substring(5) : filters;
  }
}
