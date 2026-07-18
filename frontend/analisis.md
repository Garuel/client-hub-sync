# 📊 Análisis Técnico del Frontend (React + Vite + Tailwind)

## 🎯 Objetivo
Identificar buenas prácticas existentes, detectar anti-patrones y proponer mejoras que eleven la calidad y la percepción profesional del proyecto, asegurando una integración robusta con el backend en **NestJS**.

---

## 📂 1. Estructura de Carpetas y Nombres

### 🟢 Aspectos Positivos
*   `src/core`: Buena separación de lógica de bajo nivel (contiene `api`, `constants` y `utils`).
*   `src/features/clientes`: Correcta aplicación de los conceptos de *Feature-Slicing* (`components`, `hooks`, `services`, `types`).
*   `src/share/type`: Buena iniciativa para compartir tipado genérico entre frontend y backend (ej. `ResponseAPI`).
*   `src/assets`: Uso correcto exclusivo para imágenes y recursos estáticos.

### ⚠️ Anti-patrón / Oportunidad de Mejora
La carpeta `share/type` mezcla tipos de arquitectura global (`ResponseAPI`) con tipos de dominio de negocio (`ClienteInterface`).

> 💡 **Recomendación:** Crear las subcarpetas `share/type/api` y `share/type/domain`, o mover los tipos de dominio directamente a `features/clientes/types`. Esto mantiene la cohesión y evita que los cambios en un dominio "contaminen" a otros.

---

## 🧱 2. Componentes UI y Arquitectura

### 2.1 Uso de Estilos
*   **Problema:** Presencia de *inline styles* en múltiples componentes (`tabla-clientes.tsx`, `buscador-clientes.tsx`, `boton-migracion.tsx`). Esto dificulta la consistencia visual, el *theming* y la reutilización.
*   **Mejora:** Migrar todo el diseño a clases nativas de Tailwind CSS o CSS Modules.

```tsx
// ❌ Antes
<div style={{ margin: '20px 0' }}>

//  Después (Tailwind)
<div className="my-5">
```
*   **Clases Huérfanas:** La clase CSS `mi-tabla-css` está declarada en duro en el JSX sin un archivo CSS dedicado. Se recomienda crear `tabla-clientes.module.css` o refactorizar completamente con Tailwind.

### 2.2 Accesibilidad (a11y)
*   **Problema:** Falta de atributos esenciales para lectores de pantalla y navegación por teclado.
*   **Mejora:** Agregar `aria-label="Buscar cliente"` al input de búsqueda y `aria-live="polite"` a los contenedores de mensajes de carga o error.

### 2.3 Consistencia de Componentes

| Componente | Observación | Propuesta de Mejora |
| :--- | :--- | :--- |
| **BotonMigracion** | Usa `react-hot-toast` directamente (Correcto). | Eliminar el estilo *inline CSS* y pasar a clases de Tailwind. |
| **BuscadorClientes** | Código de filtro por estado (`active`) comentado. | Si no se usa, eliminarlo. Si se planea usar, moverlo a un componente de filtrado reutilizable. |
| **TablaClientes** | Paginación deficiente (solo Anterior / Siguiente). | Implementar controles robustos (números de página, salto a inicio/fin) y desactivar "Siguiente" cuando `totalPages === 0`. |

### 2.4 Separación de Responsabilidades
*   **Logro:** Excelente uso de `useCallback` en el hook `useClientes` para manejar la lógica de *fetching*, paginación y estado.
*   **Mejora:** En lugar de declarar un `useState` independiente por cada campo de filtrado (`search`, `active`), agruparlos en un único objeto de filtros. Considerar el uso de `useSearchParams` para sincronizar el estado con la URL (*deep-linking* y páginas compartibles).

---

## 🔌 3. Tipado y Cliente API

### 3.1 Cliente Axios (`api-client.ts`)
El cliente actual no captura variables de entorno dinámicas ni maneja interceptores globales para fallos.

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Inyección correcta en Vite
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // 💡 Aquí se puede disparar un toast automatizado o mapear un error tipado
    return Promise.reject(err);
  },
);
```

> ⚠️ **Validación Crítica:** Asegurarse de que el tipo `ResponseAPI` coincida 1-a-1 con la interfaz del backend (`src/core/domain/interfaces/response-api.interface.ts`). Si divergen, usar mapeadores o validación en tiempo de ejecución con **Zod**.

### 3.2 Centralización de Endpoints
*   **Logro:** Buen uso de `ENDPOINTS.MIGRATION.RUN` en `clientes.service.ts`.
*   **Mejora:** Agrupar bajo el mismo *namespace* o estructura de objeto todos los endpoints relacionados a clientes (`/migration/clients`, `/migration/clients/:id`) y congelar el objeto con `as const` o un `enum`.

### 3.3 Gestión de Estado y Caching
*   **Problema:** Los datos se solicitan al servidor cada vez que el hook se monta, generando peticiones innecesarias.
*   **Mejora:** Integrar **TanStack Query (React Query)** o **SWR** para cachear respuestas, habilitar reintentos automáticos e invalidar la caché inmediatamente después de un proceso de migración exitoso.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Ejemplo de implementación analizada
const { data, isLoading } = useQuery(['clientes', filtros], fetchClientes);

const { mutate } = useMutation(ejecutarEtl, {
  onSuccess: () => queryClient.invalidateQueries(['clientes']) // Refetch automático
});
```

---

## 🔄 4. Conexión Front-Back (API)

| Área | Buenas Prácticas Observadas | Oportunidades de Mejora |
| :--- | :--- | :--- |
| **DTO / Responses** | El backend usa `class-validator` y `class-transformer` de forma óptima. | Integrar **OpenAPI (Swagger)** en NestJS y generar automáticamente los tipos de TypeScript en el Front usando `nestjs/swagger` + `typescript-fetch`. |
| **Paginación** | Coincidencia en el envío de parámetros `limit` y `page`. | Validar en el cliente que el `limit` nunca sea menor al mínimo del backend (3) usando `Math.max(3, limit)`. |
| **Manejo de Errores** | El hook captura `err.response?.data?.message`. | Trasladar esta lógica al interceptor global de Axios para lanzar un `CustomError` unificado y limpiar los hooks de código repetitivo. |
| **CORS / Seguridad** | No se evidenció configuración explícita en el servidor. | Habilitar CORS de manera estricta en el `main.ts` de NestJS apuntando a la variable de entorno `process.env.FRONTEND_URL`. |
| **Autenticación** | No implementada en la muestra actual. | Si el negocio lo requiere, preparar el interceptor de Axios para adjuntar el encabezado `Authorization: Bearer <JWT>` y gestionar el refresco de tokens. |

---

## 🛠️ 5. Calidad de Código y Herramientas

*   **Linter & Formatter:** Mientras el backend utiliza `oxlint`, el frontend carece de un script de linting en su `package.json`.
    *   *Solución:* Instalar **ESLint** + **Prettier** con los plugins de React e Imports, y configurar `lint-staged` con `husky` para formatear de forma automática antes de cada *commit*.
*   **Testing:** Cobertura existente en backend (`*.spec.ts`) pero nula en el frontend.
    *   *Solución:* Implementar **Vitest** (o Jest) junto a **React Testing Library** para asegurar el comportamiento de componentes críticos como `TablaClientes` y `BotonMigracion`.
*   **TypeScript Estricto:** El archivo `tsconfig.json` del frontend tiene desactivadas las restricciones clave (`noImplicitAny: false`).
    *   *Solución:* Activar `strict: true`, `noImplicitAny`, `noUnusedLocals` y `noUnusedParameters` para mitigar errores de tipo silenciosos en producción.
*   **Gestión de Dependencias:** El stack de librerías (`axios`, `react-hot-toast`, `lucide-react`) es adecuado. Se sugiere asegurar las versiones mediante el uso mandatorio del archivo `package-lock.json`.

---

## 🎨 6. Experiencia de Usuario (UX) y UI

*   **Diseño Visual:** Uso muy plano de selectores de color elementales. El soporte para modo oscuro está limitado a definiciones en `index.css`.
    *   *Mejora:* Explotar las variantes `dark:` de Tailwind CSS y centralizar la paleta de colores corporativa en el archivo `tailwind.config.js`.
*   **Micro-interacciones:** Ausencia de transiciones al interactuar con elementos o procesar estados.
    *   *Mejora:* Añadir clases de transición suave (`transition-all duration-200`) en botones y estados *hover*.
*   **Feedback de Carga:** El texto plano "Cargando información..." reduce la percepción de calidad de la app.
    *   *Mejora:* Reemplazarlo por componentes de esqueleto (**Skeleton Loaders**) animados con la clase `animate-pulse` de Tailwind o spinners estilizados.
*   **Responsividad:** Tablas con `width: 100%` que causan desborde horizontal en dispositivos móviles.
    *   *Mejora:* Implementar contenedores con scroll horizontal programado (`overflow-x-auto`) u ocultar columnas secundarias en pantallas pequeñas utilizando *breakpoints* (`hidden md:table-cell`).

---

## 🚀 Resumen de Acciones Recomendadas (Orden de Prioridad)

1.  🛑 **Migrar estilos inline** a clases de Tailwind CSS o CSS Modules para unificar la interfaz.
2.  🛑 **Configurar el interceptor global** en `api-client.ts` para centralizar la gestión de errores HTTP y la `baseURL`.
3.  🟡 **Integrar TanStack Query (React Query)** para manejar la caché de datos y automatizar la revalidación tras las migraciones.
4.  🟡 **Refactorizar el almacenamiento de tipos**, aislando los tipos genéricos de API de los tipos de dominio del cliente.
5.  🟡 **Elevar las restricciones de TypeScript** (`strict: true`) y estandarizar el formateo configurando ESLint y Prettier.
6.  🟢 **Optimizar la accesibilidad**: Incorporar etiquetas ARIA, asegurar el manejo de focos en formularios y validar ratios de contraste mínimos.
7.  🟢 **Sincronizar contratos con OpenAPI (Swagger)** generando de forma automática los tipos de TypeScript desde el backend.
8.  🟢 **Diseñar Skeleton Loaders** y micro-animaciones para enriquecer el feedback visual de la aplicación.
