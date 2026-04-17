/** Plantilla de correo electrónico obtenida desde el servicio de cola. */
export interface PlantillaRespuestaModel {
  /** Contenido de la plantilla, generalmente en formato HTML. */
  Plantilla: string;

  /** Indica si la plantilla está en formato HTML. */
  EsHtml: boolean;

  /** Asunto del correo asociado a la plantilla. */
  Asunto: string;
}
