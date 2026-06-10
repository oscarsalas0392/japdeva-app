import { inject, Injectable } from '@angular/core';
import { EstadoAppService } from '../state/app.service';
import { ClaveEstado } from '../state/claves-estado';

/**
 * Servicio genérico de caché con patrón stale-while-revalidate.
 * Aplica el valor cacheado al instante (si existe) y refresca desde el backend
 * en segundo plano, actualizando la UI y el cache si el contenido cambió.
 */
@Injectable({ providedIn: 'root' })
export class ParametrosCacheService {
  private readonly estadoService = inject(EstadoAppService);

  /**
   * Carga un valor aplicando primero la versión cacheada y luego refrescando del API.
   * @param clave Clave del estado donde se persiste.
   * @param obtenerDelApi Función que devuelve el valor fresco (o null si falla).
   * @param onActualizar Callback que actualiza la UI con el valor — se llama una vez
   *   con el cache (si existe) y, si los datos del API son distintos, una segunda vez.
   * @returns El valor final aplicado (fresco si llegó, sino el cacheado).
   */
  async cargarConCache<T>(
    clave: ClaveEstado,
    obtenerDelApi: () => Promise<T | null>,
    onActualizar: (datos: T) => void,
  ): Promise<T | null> {
    const cacheado = await this.estadoService.obtener<T>(clave);
    if (cacheado) {
      onActualizar(cacheado);
    }

    const fresco = await obtenerDelApi();
    if (fresco && JSON.stringify(fresco) !== JSON.stringify(cacheado)) {
      onActualizar(fresco);
      await this.estadoService.guardar(clave, fresco);
    }

    return fresco ?? cacheado;
  }
}
