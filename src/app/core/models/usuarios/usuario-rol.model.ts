/** Datos de la asignación de un rol a un usuario. */
export interface UsuarioRolRespuestaModel {
  /** Identificador único del registro. */
  Id: number;

  /** Identificador del usuario. */
  IdUsuario: number;

  /** Identificador del rol asignado. */
  IdRol: number;

  /** Fecha de creación del registro en formato ISO 8601. */
  FechaRegistro: string;

  /** Indica si la asignación está activa. */
  Activo: boolean;
}
