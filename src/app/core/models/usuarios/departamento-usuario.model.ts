/** Datos de la asignación de un usuario a un departamento. */
export interface DepartamentoUsuarioRespuestaModel {
  /** Identificador único del registro. */
  Id: number;

  /** Identificador del usuario asignado. */
  IdUsuario: number;

  /** Identificador del departamento. */
  IdDepartamento: number;

  /** Identificador del administrador que realizó la asignación. */
  IdUsuarioAdministrador: number;

  /** Fecha de creación del registro en formato ISO 8601. */
  FechaRegistro: string;

  /** Indica si la asignación está activa. */
  Activo: boolean;
}
