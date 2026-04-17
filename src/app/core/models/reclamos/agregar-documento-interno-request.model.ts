import { ArchivoSolicitudModel } from './documento.model';

/** Datos requeridos para adjuntar documentos internos a un detalle de reclamo. */
export interface AgregarDocumentoInternoSolicitudModel {
  /** Identificador del detalle de reclamo al que se adjuntan los documentos. */
  IdDetalleReclamo: number;

  /** Lista de archivos a adjuntar en formato Base64. */
  ListaDocumentos: ArchivoSolicitudModel[];
}
