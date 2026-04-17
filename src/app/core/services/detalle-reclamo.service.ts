import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { RespuestaListaModel } from '../models/respuesta-lista.model';
import { DetalleReclamoRespuestaModel } from '../models/reclamos/detalle-reclamo.model';
import { EditarDetalleReclamoSolicitudModel } from '../models/reclamos/editar-detalle-reclamo-request.model';
import { DocumentoInternoRespuestaModel } from '../models/reclamos/documento-interno.model';
import { AgregarDocumentoInternoSolicitudModel } from '../models/reclamos/agregar-documento-interno-request.model';
import { EstadoDetalleReclamoRespuestaModel } from '../models/reclamos/estado-detalle.model';
import { OrdenNivelRespuestaModel } from '../models/reclamos/orden-nivel.model';

@Injectable({ providedIn: 'root' })
export class DetalleReclamoService {
  private readonly api = inject(ApiService);
  private readonly ep = environment.endpoints.reclamos.detalleReclamo;
  private readonly epDocInterno = environment.endpoints.reclamos.documentoInterno;
  private readonly epEstadoDetalle = environment.endpoints.reclamos.estadoDetalle;
  private readonly epOrdenNivel = environment.endpoints.reclamos.ordenNivel;

  // ── Detalle Reclamo ───────────────────────────────────────────────────────

  /**
   * Obtiene el detalle activo de un reclamo.
   * @param idReclamo Identificador del reclamo.
   */
  obtener(idReclamo: number): Promise<RespuestaModel<DetalleReclamoRespuestaModel>> {
    return this.api.get(this.ep.obtener, { idReclamo });
  }

  /**
   * Edita el detalle de un reclamo (estado, asignación, descripción).
   * @param solicitud Datos actualizados del detalle.
   */
  editar(solicitud: EditarDetalleReclamoSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.put(this.ep.editar, solicitud);
  }

  /**
   * Obtiene el histórico de detalles de un reclamo.
   * @param idReclamo Identificador del reclamo.
   */
  obtenerHistorico(idReclamo: number): Promise<RespuestaModel<RespuestaListaModel<DetalleReclamoRespuestaModel>>> {
    return this.api.get(this.ep.historico, { idReclamo });
  }

  // ── Documento Interno ─────────────────────────────────────────────────────

  /**
   * Adjunta documentos internos a un detalle de reclamo.
   * @param solicitud Datos con los documentos en Base64.
   */
  agregarDocumento(solicitud: AgregarDocumentoInternoSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.post(this.epDocInterno.agregar, solicitud);
  }

  /**
   * Obtiene los documentos internos de un reclamo.
   * @param idReclamo Identificador del reclamo.
   */
  obtenerDocumentosPorReclamo(idReclamo: number): Promise<RespuestaModel<RespuestaListaModel<DocumentoInternoRespuestaModel>>> {
    return this.api.get(this.epDocInterno.obtenerPorReclamo, { idReclamo });
  }

  /**
   * Elimina un documento interno por su identificador.
   * @param id Identificador del documento.
   */
  eliminarDocumento(id: number): Promise<RespuestaModel<void>> {
    return this.api.delete(this.epDocInterno.eliminar, { id });
  }

  /**
   * Obtiene el histórico de documentos internos de un detalle de reclamo.
   * @param idDetalleReclamo Identificador del detalle de reclamo.
   */
  obtenerHistoricoDocumentos(idDetalleReclamo: number): Promise<RespuestaModel<RespuestaListaModel<DocumentoInternoRespuestaModel>>> {
    return this.api.get(this.epDocInterno.historico, { idDetalleReclamo });
  }

  // ── Estado Detalle ────────────────────────────────────────────────────────

  /**
   * Obtiene todos los estados disponibles para el detalle de un reclamo.
   */
  obtenerEstados(): Promise<RespuestaModel<RespuestaListaModel<EstadoDetalleReclamoRespuestaModel>>> {
    return this.api.get(this.epEstadoDetalle.obtenerTodos);
  }

  // ── Orden Nivel ───────────────────────────────────────────────────────────

  /**
   * Obtiene todos los niveles del flujo de proceso de reclamos.
   */
  obtenerOrdenesNivel(): Promise<RespuestaModel<RespuestaListaModel<OrdenNivelRespuestaModel>>> {
    return this.api.get(this.epOrdenNivel.obtenerTodos);
  }
}
