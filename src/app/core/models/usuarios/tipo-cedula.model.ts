/** Datos de un tipo de cédula de identificación. */
export interface TipoCedulaRespuestaModel {
  /** Identificador único del tipo de cédula. */
  Id: number;

  /** Nombre del tipo de cédula (ej. Nacional, Residente). */
  Tipo: string;

  /** Expresión o formato de validación del número de cédula. */
  Formato: string;

  /** Indica si el tipo de cédula está activo. */
  Activo: boolean;
}
