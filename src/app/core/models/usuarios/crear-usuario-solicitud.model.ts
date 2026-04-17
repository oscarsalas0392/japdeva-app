/** Datos mínimos requeridos para crear un usuario. */
export interface CrearUsuarioSolicitudModel {
  /** Nombre del usuario. */
  Nombre: string;

  /** Correo electrónico del usuario. */
  Correo: string;

  /** Número de teléfono del usuario. */
  Telefono: string;
}
