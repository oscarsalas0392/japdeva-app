/** Datos completos de un reclamo registrado en el sistema. */
export interface ReclamoRespuestaModel {
  /** Identificador único del reclamo. */
  Id: number;

  /** Título del reclamo. */
  Titulo: string;

  /** Descripción detallada del reclamo. */
  Descripcion: string;

  /** Identificador del estado actual del reclamo. */
  IdEstadoReclamo: number;

  /** Descripción del estado actual del reclamo. */
  DescripcionEstadoReclamo: string;

  /** Identificador del usuario externo que realizó el reclamo. */
  IdUsuarioExterno: number;

  /** Nombre del usuario externo que realizó el reclamo. */
  NombreUsuarioExterno: string;

  /** Fecha en que se registró el reclamo en formato ISO 8601. */
  FechaRegistro: string;

  /** Identificador del departamento actual encargado del reclamo. */
  IdDepartamentoActual: number;

  /** Descripción del departamento actual encargado del reclamo. */
  DescripcionDepartamento: string;

  /** Indica si el reclamo se encuentra en el histórico. */
  EstaEnHistorico: boolean;
}
