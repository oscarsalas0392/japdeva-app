/** Datos requeridos para actualizar la contraseña de un usuario. */
export interface ActualizarContrasenaRequest {
  /** Identificador del usuario. */
  Id: number;

  /** Contraseña actual del usuario. */
  ContrasenaAnterior: string;

  /** Nueva contraseña a establecer. */
  ContrasenaNueva: string;
}
