/** Documento adjunto por un usuario asociado a un reclamo. */
export interface DocumentoUsuarioRespuestaModel {
  /** Identificador único del documento. */
  Id: number;

  /** Identificador del reclamo asociado al documento. */
  IdReclamo: number;

  /** Nombre del archivo incluyendo su extensión. */
  NombreDocumento: string;

  /** Contenido del documento codificado en Base64. */
  Documento: string;
}
