/**
 * Estados posibles del detalle de un reclamo durante su ciclo de atención.
 */
export enum EstadoDetalleReclamoEnum {
  /** Detalle registrado pero pendiente de procesamiento. */
  Pendiente = 1,

  /** Detalle en revisión o siendo procesado. */
  EnProceso = 2,

  /** Detalle completado exitosamente. */
  Completado = 3,

  /** Detalle rechazado o no procesable. */
  Rechazado = 4,

  /** Detalle devuelto a otro departamento. */
  Devuelto = 5,
}
