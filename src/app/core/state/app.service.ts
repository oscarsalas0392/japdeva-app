import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { EstadoApp, EstablecerDato, EliminarDato, LimpiarEstado } from './app.state';
import { ClaveEstado } from './claves-estado';

@Injectable({ providedIn: 'root' })
export class EstadoAppService {
  private readonly store = inject(Store);

  /**
   * Guarda un valor en el estado bajo una clave específica.
   * @param clave Clave definida en ClavesEstado.
   * @param valor Dato a guardar.
   */
  async guardar<T>(clave: ClaveEstado, valor: T): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EstablecerDato(clave, valor)));
  }

  /**
   * Retorna el valor actual del estado.
   * @param clave Clave definida en ClavesEstado.
   */
  async obtener<T>(clave: ClaveEstado): Promise<T | null> {
    return await firstValueFrom(this.store.select(EstadoApp.seleccionar<T>(clave)));
  }

  /**
   * Elimina un valor del estado por su clave.
   * @param clave Clave definida en ClavesEstado.
   */
  async eliminar(clave: ClaveEstado): Promise<void> {
    await firstValueFrom(this.store.dispatch(new EliminarDato(clave)));
  }

  /**
   * Limpia todo el estado de la aplicación.
   */
  async limpiar(): Promise<void> {
    await firstValueFrom(this.store.dispatch(new LimpiarEstado()));
  }
}
