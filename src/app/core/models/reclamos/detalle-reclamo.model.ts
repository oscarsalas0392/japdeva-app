/** Información detallada de un detalle de reclamo. */
export interface DetalleReclamoRespuestaModel {
  /** Identificador único del detalle de reclamo. */
  Id: number;

  /** Identificador del reclamo al que pertenece este detalle. */
  IdReclamo: number;

  /** Identificador del usuario interno asignado. Null si no hay usuario asignado. */
  IdUsuarioInterno?: number;

  /** Nombre del usuario interno asignado al detalle. */
  NombreUsuarioInterno: string;

  /** Identificador del nivel de proceso asociado al detalle. */
  IdNivelProceso: number;

  /** Identificador del departamento responsable del detalle. */
  IdDepartamento: number;

  /** Nombre del departamento responsable del detalle. */
  NombreDepartamento: string;

  /** Identificador del estado actual del detalle de reclamo. */
  IdEstadoDetalleReclamo: number;

  /** Descripción del estado actual del detalle de reclamo. */
  DescripcionEstadoDetalleReclamo: string;

  /** Descripción o comentarios adicionales del detalle. */
  Descripcion: string;
}
