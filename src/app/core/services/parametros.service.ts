import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { RespuestaListaModel } from '../models/respuesta-lista.model';
import { Mensaje } from '../models/parametros/mensaje.model';
import { Menu } from '../models/parametros/menu.model';

@Injectable({ providedIn: 'root' })
export class ParametrosService {
  private readonly api = inject(ApiService);
  private readonly epMensaje = environment.endpoints.parametros.mensaje;
  private readonly epMenu = environment.endpoints.parametros.menu;

  /**
   * Obtiene los mensajes configurados para una pantalla específica.
   * @param pantalla Número de pantalla.
   */
  obtenerMensajesPorPantalla(pantalla: number): Promise<RespuestaModel<RespuestaListaModel<Mensaje>>> {
    return this.api.get(this.epMensaje.obtenerPorPantalla, { pantalla });
  }

  /**
   * Obtiene los ítems de menú asociados a un perfil de usuario.
   * @param idPerfil Identificador del perfil.
   */
  obtenerMenusPorPerfil(idPerfil: number): Promise<RespuestaModel<RespuestaListaModel<Menu>>> {
    return this.api.get(this.epMenu.obtenerPorPerfil, { idPerfil });
  }
}
