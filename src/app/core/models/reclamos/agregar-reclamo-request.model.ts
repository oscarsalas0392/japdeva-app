import { ArchivoSolicitudModel } from './documento.model';

/** Datos requeridos para registrar un nuevo reclamo. */
export interface AgregarReclamoSolicitudModel {
  /** Identificador de la solicitud (0 al crear). */
  Id: number;

  /** Título descriptivo del reclamo. */
  Titulo: string;

  /** Descripción detallada del reclamo. */
  Descripcion: string;

  /** Identificador del usuario externo que crea el reclamo. */
  IdUsuarioExterno: number;

  /** Lista de archivos de soporte adjuntos al reclamo. */
  ListaDocumentos: ArchivoSolicitudModel[];
}
