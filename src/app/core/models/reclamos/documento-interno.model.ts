/** Documento interno asociado a un detalle de reclamo. */
export interface DocumentoInternoRespuestaModel {
  /** Identificador único del documento interno. */
  Id: number;

  /** Identificador del detalle de reclamo asociado. */
  IdDetalleReclamo: number;

  /** Nombre del archivo incluyendo su extensión. */
  NombreDocumento: string;

  /** Contenido del documento codificado en Base64. */
  Documento: string;
}
