/** Datos de un rol del sistema. */
export interface RolRespuestaModel {
  /** Identificador único del rol. */
  Id: number;

  /** Descripción del rol. */
  Descripcion: string;

  /** Indica si el rol está activo. */
  Activo: boolean;
}
