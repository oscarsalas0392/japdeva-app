import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { RespuestaListaModel } from '../models/respuesta-lista.model';
import { Mensaje } from '../models/parametros/mensaje.model';

import { Menu } from '../models/parametros/menu.model';
import { ParametroModel } from '../models/parametros/parametro.model';

@Injectable({ providedIn: 'root' })
export class ParametrosService {
  private readonly api        = inject(ApiService);
  private readonly epMensaje  = environment.endpoints.parametros.mensaje;
  private readonly epMenu     = environment.endpoints.parametros.menu;
  private readonly epParametro = environment.endpoints.parametros.parametro;

  obtenerMensajesPorPantalla(pantalla: number): Promise<RespuestaModel<RespuestaListaModel<Mensaje>>> {
    return this.api.get(this.epMensaje.obtenerPorPantalla, { pantalla });
  }

  obtenerMenusPorPerfil(idPerfil: number): Promise<RespuestaModel<RespuestaListaModel<Menu>>> {
    return this.api.get(this.epMenu.obtenerPorPerfil, { idPerfil });
  }

  obtenerParametroPorNombre(nombre: string): Promise<RespuestaModel<ParametroModel>> {
    return this.api.get(this.epParametro.obtenerPorNombre, { nombre });
  }

  obtenerParametrosPorNombres(nombres: string[]): Promise<RespuestaModel<ParametroModel[]>> {
    return this.api.get(this.epParametro.obtenerPorNombres, { nombres });
  }
}
