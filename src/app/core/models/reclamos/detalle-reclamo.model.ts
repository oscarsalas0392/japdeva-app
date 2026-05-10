export interface DetalleReclamoRespuestaModel {
  id: number;
  idReclamo: number;
  idUsuarioInterno?: number;
  nombreUsuarioInterno: string;
  idNivelProceso: number;
  idDepartamento: number;
  nombreDepartamento: string;
  descripcionEstadoDetalleReclamo: string;
  descripcion: string;
  fechaRegistro: string;
}
