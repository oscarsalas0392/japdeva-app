/** Datos completos de un usuario del sistema. */
export interface UsuarioRespuestaModel {
  /** Identificador único del usuario. */
  Id: number;

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

  /** Fecha de creación del registro en formato ISO 8601. */
  FechaRegistro: string;

  /** Fecha de última modificación en formato ISO 8601. Null si no ha sido editado. */
  FechaEdicion?: string;

  /** Indica si el usuario está activo en el sistema. */
  Activo: boolean;
}
