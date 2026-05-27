/** Datos requeridos para asignar un detalle de reclamo a un usuario interno. */
export interface AsignarDetalleReclamoSolicitudModel {
  /** Identificador único del detalle del reclamo a asignar. */
  IdDetalleReclamo: number;

  /** Identificador del usuario interno que tomará el caso. */
  IdUsuarioInterno: number;
}
