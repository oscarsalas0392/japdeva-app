export interface DocumentoInternoRespuestaModel {
  id: number;
  idDetalleReclamo: number;
  nombreDocumento: string;
  documento: string;
  descripcionDetalleReclamo?: string;
  nombreDepartamento?: string;
}
