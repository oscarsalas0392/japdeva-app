/** Datos requeridos para actualizar los datos de un usuario existente. */
export interface ActualizarUsuarioSolicitudModel {
  /** Identificador del usuario a actualizar. */
  Id: number;

  /** Nuevo nombre del usuario. */
  Nombre: string;

  /** Nuevos apellidos del usuario. */
  Apellidos: string;
}
