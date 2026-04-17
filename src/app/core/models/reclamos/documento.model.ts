/** Archivo adjunto a una solicitud codificado en Base64. */
export interface ArchivoSolicitudModel {
  /** Nombre del archivo incluyendo su extensión (ej. documento.pdf). */
  NombreArchivo: string;

  /** Contenido del archivo codificado en Base64. */
  ContenidoArchivo: string;
}
