/** Datos requeridos para registrar un nuevo usuario en el sistema. */
export interface AgregarUsuarioSolicitudModel {
  /** Número de identificación (cédula) del usuario. */
  Identificacion: string;

  /** Identificador del tipo de cédula. */
  IdTipoCedula: number;

  /** Nombre del usuario. */
  Nombre: string;

  /** Apellidos del usuario. */
  Apellidos: string;

  /** Correo electrónico del usuario. */
  Correo: string;

  /** Contraseña del usuario. */
  Contrasena: string;

  /** Número de teléfono del usuario. */
  Telefono: string;

  /** Fecha de nacimiento del usuario (ISO 8601: YYYY-MM-DD). */
  FechaNacimiento: string;
}
