/** Datos de un departamento de la organización. */
export interface DepartamentoRespuestaModel {
  /** Identificador único del departamento. */
  Id: number;

  /** Descripción del departamento. */
  Descripcion: string;

  /** Indica si el departamento está activo. */
  Activo: boolean;
}
