/** Datos retornados al editar exitosamente un detalle de reclamo. */
export interface EditarDetalleReclamoRespuestaModel {
  /** Identificador único del detalle del reclamo editado. */
  Id: number;

  /** Identificador del estado actual del detalle después de la edición. */
  IdEstadoDetalleReclamo: number;

  /** Fecha y hora en que se realizó la edición en formato ISO 8601. */
  FechaEdicion: string;
}
