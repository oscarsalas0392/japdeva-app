/** Datos requeridos para actualizar la asignación de un rol a un usuario. */
export interface ActualizarUsuarioRolSolicitudModel {
  /** Identificador del registro de asignación a actualizar. */
  Id: number;

  /** Nuevo identificador del rol. */
  IdRol: number;

  /** Nuevo identificador del usuario. */
  IdUsuario: number;

  /** Identificador del administrador que realiza la actualización. Opcional. */
  IdUsuarioAdministrador?: number;
}
