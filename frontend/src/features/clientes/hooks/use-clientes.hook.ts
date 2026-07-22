
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ClientesService } from "../services/clientes.service";

export const useClientes = (initialLimit = 3) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const search = searchParams.get("search") || "";
  const active = searchParams.get("active") !== "false";
  const page = Number(searchParams.get("page")) || 1;

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientes", { page, search, active, limit: initialLimit }],
    queryFn: () =>
      ClientesService.obtenerClientesMigrados({
        page,
        limit: initialLimit,
        search: search || undefined,
        active,
        migrado: true,
      }),
    staleTime: 1000 * 60 * 5
  });

  const migracionClientes = useMutation({
    mutationFn: ClientesService.migrarClientes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });


  const actualizarFiltros = (nuevosFiltros: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

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
    clientes: response?.data ?? [],
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    page,
    totalPages: response?.meta.totalPages ?? 1,
    totalItems: response?.meta.totalItems ?? 0,
    search,
    active,
    cambiarPagina: (nuevaPagina: number) => {
      const totalPages = response?.meta.totalPages ?? 1;
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
    refrescar: refetch,
    ejecutarEtl: migracionClientes.mutate,
    ejecutandoEtl: migracionClientes.isPending,
  };
};