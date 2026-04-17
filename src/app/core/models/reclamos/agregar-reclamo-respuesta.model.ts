/** Datos del reclamo retornados al crearse exitosamente. */
export interface AgregarReclamoRespuestaModel {
  /** Identificador único generado por el sistema para el reclamo creado. */
  Id: number;

  /** Título registrado del reclamo. */
  Titulo: string;

  /** Descripción registrada del reclamo. */
  Descripcion: string;
}
