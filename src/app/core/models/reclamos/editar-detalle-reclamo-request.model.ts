/** Datos requeridos para editar el detalle de un reclamo. */
export interface EditarDetalleReclamoSolicitudModel {
  /** Identificador único del detalle del reclamo a editar. */
  IdDetalleReclamo: number;

  /** Nuevo estado del detalle del reclamo. */
  IdEstadoDetalleReclamo: number;

  /** Identificador del siguiente nivel en el proceso. Opcional. */
  IdNivelSiguienteProceso?: number;

  /** Identificador del usuario interno asignado. Opcional. */
  IdUsuarioInterno?: number;

  /** Descripción de la acción o gestión realizada. */
  Descripcion: string;

  /** Descripción de la resolución aplicada. */
  DescripcionResolucion: string;
}
