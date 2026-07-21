import { useState, useEffect, useCallback } from "react";
import type { ClienteInterface } from "../types/cliente.type";
import { ClientesService } from "../services/clientes.service";
import { useSearchParams } from "react-router-dom";

export const useClientes = (initialLimit = 3) => {
  const [clientes, setClientes] = useState<ClienteInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const active = searchParams.get("active") !== "false";
  const page = Number(searchParams.get("page")) || 1;

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

  const actualizarFiltros = (nuevosFiltros: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)

      Object.entries(nuevosFiltros).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (!nuevosFiltros.page) {
        params.set("page", "1");
      }

      return params;
    });
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
    cambiarPagina: (nuevaPagina: number) => {
      if (nuevaPagina > 0 && nuevaPagina <= totalPages) {
        actualizarFiltros({ page: nuevaPagina.toString() });
      }
    },
    aplicarBusqueda: (termino: string) => {
      actualizarFiltros({ search: termino });
    },
    setEstadoActivo: (val: boolean) => {
      actualizarFiltros({ active: val.toString() });
    },
    refrescar: cargarClientes,
  };
};