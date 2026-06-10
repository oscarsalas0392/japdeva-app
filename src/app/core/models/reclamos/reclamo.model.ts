/** Datos completos de un reclamo registrado en el sistema. */
export interface ReclamoRespuestaModel {
  id: number;
  titulo: string;
  descripcion: string;
  idEstadoReclamo: number;
  descripcionEstadoReclamo: string;
  idUsuarioExterno: number;
  nombreUsuarioExterno: string;
  fechaRegistro: string;
  idDepartamentoActual: number;
  descripcionDepartamento: string;
  descripcionEstadoDetalleReclamo: string;
  idEstadoDetalleReclamo: number;
  estaEnHistorico: boolean;
  idUsuarioInterno?: number;
  nombreUsuarioInterno?: string;
  /** Texto de la resolución final. Solo presente cuando el reclamo está Completado o Rechazado. */
  descripcionResolucion?: string;
}
