/** Datos necesarios para solicitar el envío de un correo electrónico. */
export interface EnviarCorreoSolicitudModel {
  /** Dirección de correo electrónico del destinatario. */
  Destinatario: string;

  /** Asunto del correo electrónico. */
  Asunto: string;

  /** Cuerpo del correo electrónico. */
  Cuerpo: string;

  /** Indica si el cuerpo del correo está en formato HTML. Por defecto true. */
  EsCuerpoHtml: boolean;
}
