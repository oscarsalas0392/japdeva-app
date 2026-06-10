import { inject, Injectable } from '@angular/core';
import { ReclamoService } from './reclamo.service';
import { DetalleReclamoService } from './detalle-reclamo.service';
import { DocumentoUsuarioRespuestaModel } from '../models/reclamos/documento-usuario-respuesta.model';
import { DocumentoInternoRespuestaModel } from '../models/reclamos/documento-interno.model';

export interface DocumentosReclamoResultado {
  /** Documentos adjuntados por el usuario externo (cliente). */
  externos: DocumentoUsuarioRespuestaModel[];
  /** Documentos internos del expediente que ya cerraron su atención (fechaFin != null). */
  internosCerrados: DocumentoInternoRespuestaModel[];
  /** Nombre del departamento actualmente activo, deducido del último doc del expediente. */
  departamentoActual: string | null;
}

/**
 * Centraliza la carga y procesamiento de documentos asociados a un reclamo.
 * Combina dos endpoints (documentos de usuario + expediente interno) y
 * extrae información derivada como el departamento actual de atención.
 */
@Injectable({ providedIn: 'root' })
export class DocumentosReclamoService {
  private readonly reclamoService  = inject(ReclamoService);
  private readonly detalleService  = inject(DetalleReclamoService);

  async cargarTodos(idReclamo: number): Promise<DocumentosReclamoResultado> {
    const [externosRespuesta, internosRespuesta] = await Promise.all([
      this.reclamoService.obtenerDocumentosUsuario(idReclamo),
      this.detalleService.obtenerExpediente(idReclamo),
    ]);

    const externos = externosRespuesta.Exito && externosRespuesta.Datos?.lista
      ? externosRespuesta.Datos.lista
      : [];

    const todosInternos = internosRespuesta.Datos?.lista ?? [];
    const internosCerrados = internosRespuesta.Exito
      ? todosInternos.filter(x => x.fechaFin != null)
      : [];

    // El último elemento (con o sin fechaFin) representa la atención más reciente
    // y por ende el departamento donde está actualmente el reclamo.
    const departamentoActual = todosInternos.length
      ? todosInternos[todosInternos.length - 1].nombreDepartamento ?? null
      : null;

    return { externos, internosCerrados, departamentoActual };
  }
}
