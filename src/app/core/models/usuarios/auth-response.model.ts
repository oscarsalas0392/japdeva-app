/** Datos del usuario retornados al autenticarse correctamente. */
export interface AutenticarUsuarioRespuestaModel {
  /** Identificador único del usuario. */
  Id: number;

  /** Nombre del usuario. */
  Nombre: string;

  /** Apellidos del usuario. */
  Apellidos: string;

  /** Correo electrónico del usuario. */
  Correo: string;

  /** Número de identificación (cédula) del usuario. */
  Identificacion: string;
}
