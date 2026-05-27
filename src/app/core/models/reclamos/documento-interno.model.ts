export interface DocumentoInternoRespuestaModel {
  id: number;
  idDetalleReclamo: number;
  nombreDocumento: string;
  documento: string;
  descripcionDetalleReclamo?: string;
  nombreDepartamento?: string;
  fechaInicio?: string;
  fechaFin?: string;
  nombreUsuarioInterno?: string;
}
