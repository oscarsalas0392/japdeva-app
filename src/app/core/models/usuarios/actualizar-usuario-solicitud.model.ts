/** Datos requeridos para actualizar los datos de un usuario existente. */
export interface ActualizarUsuarioSolicitudModel {
  /** Identificador del usuario a actualizar. */
  Id: number;

  /** Nuevo nombre del usuario. */
  Nombre: string;

  /** Nuevos apellidos del usuario. */
  Apellidos: string;

  /** Número de teléfono del usuario. */
  Telefono: string;

  /** Fecha de nacimiento del usuario (ISO 8601: YYYY-MM-DD). */
  FechaNacimiento: string;
}
