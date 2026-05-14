export interface EstadoDetalleReclamoRespuestaModel {
  idEstadoDetalleReclamo: number;
  descripcionEstadoDetalleReclamo: string;
  continuaProceso: boolean;
  rechazaProceso: boolean;
  devolucionProceso: boolean;
  finalizarProceso: boolean;
}
