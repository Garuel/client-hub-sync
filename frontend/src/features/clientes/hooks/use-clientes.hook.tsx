import { useState, useEffect, useCallback } from "react";
import type { ClienteInterface } from "../types/cliente.type";
import { ClientesService } from "../services/clientes.service";

export const useClientes = (initialLimit = 3) => {
  const [clientes, setClientes] = useState<ClienteInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const [search, setSearch] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const cargarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientesService.obtenerClientesMigrados({
        page,
        limit: initialLimit,
        search: search || undefined,
        active,
        migrado: true,
      });

      if (response.success) {
        setClientes(response.data);

        setTotalItems(response.meta.totalItems);
        setTotalPages(response.meta.totalPages);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Error al conectar con el servidor de base de datos.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, active, initialLimit]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPages) {
      setPage(nuevaPagina);
    }
  };

  const aplicarBusqueda = (termino: string) => {
    setSearch(termino);
    setPage(1);
  };

  return {
    clientes,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    search,
    active,
    cambiarPagina,
    aplicarBusqueda,
    setActive: (val: boolean) => {
      setActive(val);
      setPage(1);
    },
    refrescar: cargarClientes,
  };
};