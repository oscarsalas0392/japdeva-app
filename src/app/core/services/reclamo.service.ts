import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { RespuestaListaModel } from '../models/respuesta-lista.model';
import { ReclamoRespuestaModel } from '../models/reclamos/reclamo.model';
import { AgregarReclamoSolicitudModel } from '../models/reclamos/agregar-reclamo-request.model';
import { DocumentoUsuarioRespuestaModel } from '../models/reclamos/documento-usuario-respuesta.model';

@Injectable({ providedIn: 'root' })
export class ReclamoService {
  private readonly api = inject(ApiService);
  private readonly ep = environment.endpoints.reclamos.reclamo;
  private readonly epDocUsuario = environment.endpoints.reclamos.documentoUsuario;

  /**
   * Registra un nuevo reclamo en el sistema.
   * @param solicitud Datos del reclamo con documentos adjuntos.
   */
  agregar(solicitud: AgregarReclamoSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.post(this.ep.agregar, solicitud);
  }

  /**
   * Obtiene los reclamos de un usuario externo.
   * @param idUsuario Identificador del usuario externo.
   */
  obtenerPorUsuario(idUsuario: number): Promise<RespuestaModel<RespuestaListaModel<ReclamoRespuestaModel>>> {
    return this.api.get(this.ep.obtenerPorUsuario, { idUsuario });
  }

  obtenerPorUsuarioOrdenado(idUsuario: number, pagina = 1): Promise<RespuestaModel<RespuestaListaModel<ReclamoRespuestaModel>>> {
    return this.api.get(this.ep.obtenerPorUsuarioOrdenado, { 'id-usuario': idUsuario, pagina });
  }

  /**
   * Obtiene los reclamos asignados a un departamento.
   * @param idDepartamento Identificador del departamento.
   */
  obtenerPorDepartamento(idDepartamento: number, pagina = 1): Promise<RespuestaModel<RespuestaListaModel<ReclamoRespuestaModel>>> {
    return this.api.get(this.ep.obtenerPorDepartamento, { 'id-departamento': idDepartamento, pagina });
  }

  /**
   * Obtiene reclamos filtrados por rango de fechas y estado.
   * @param fechaInicio Fecha de inicio del filtro (ISO 8601).
   * @param fechaFin Fecha de fin del filtro (ISO 8601). Opcional.
   * @param idEstado Identificador del estado del reclamo.
   * @param pagina Número de página (default 1).
   */
  obtenerPorFechaEstado(fechaInicio: string, fechaFin: string | null, idEstado: number, pagina = 1): Promise<RespuestaModel<RespuestaListaModel<ReclamoRespuestaModel>>> {
    const params: Record<string, string | number> = {
      'fecha-inicio':      fechaInicio,
      'id-estado-reclamo': idEstado,
      pagina,
    };
    if (fechaFin) params['fecha-fin'] = fechaFin;
    return this.api.get(this.ep.obtenerPorFechaEstado, params);
  }

  /**
   * Obtiene los documentos adjuntos por el usuario de un reclamo.
   * @param idReclamo Identificador del reclamo.
   */
  obtenerDocumentosUsuario(idReclamo: number, pagina = 1): Promise<RespuestaModel<RespuestaListaModel<DocumentoUsuarioRespuestaModel>>> {
    return this.api.get(this.epDocUsuario.obtener, { 'id-reclamo': idReclamo, pagina });
  }

  /**
   * Obtiene un reclamo por su identificador único.
   * @param idReclamo Identificador del reclamo.
   */
  obtenerPorId(idReclamo: number): Promise<RespuestaModel<ReclamoRespuestaModel>> {
    return this.api.get(this.ep.obtenerPorId, { 'id-reclamo': idReclamo });
  }

  /**
   * Obtiene el histórico de documentos de usuario de un reclamo.
   * @param idReclamo Identificador del reclamo.
   */
  obtenerHistoricoDocumentosUsuario(idReclamo: number, pagina = 1): Promise<RespuestaModel<RespuestaListaModel<DocumentoUsuarioRespuestaModel>>> {
    return this.api.get(this.epDocUsuario.historico, { 'id-reclamo': idReclamo, pagina });
  }
}
