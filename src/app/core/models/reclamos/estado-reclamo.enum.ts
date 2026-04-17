/**
 * Estados posibles de un reclamo durante su ciclo de vida.
 */
export enum EstadoReclamoEnum {
  /** Reclamo registrado pero aún no procesado. */
  Pendiente = 1,

  /** Reclamo siendo atendido por el personal interno. */
  EnProceso = 2,

  /** Reclamo resuelto satisfactoriamente. */
  Completado = 3,

  /** Reclamo rechazado. */
  Rechazado = 4,
}
