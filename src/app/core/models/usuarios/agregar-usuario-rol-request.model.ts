/** Datos requeridos para asignar un rol a un usuario. */
export interface AgregarUsuarioRolRequest {
  /** Identificador del rol a asignar. */
  IdRol: number;

  /** Identificador del usuario al que se asigna el rol. */
  IdUsuario: number;

  /** Identificador del usuario administrador que realiza la asignación. */
  IdUsuarioAdministrador: number;
}
