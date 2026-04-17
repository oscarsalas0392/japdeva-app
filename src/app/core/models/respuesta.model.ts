/** Modelo genérico de respuesta del API Gateway. */
export interface RespuestaModel<T = unknown> {
  /** Indica si la operación fue exitosa. */
  Exito: boolean;

  /** Identificador único de la respuesta. */
  Identificador: string;

  /** Mensaje descriptivo del resultado de la operación. */
  Mensaje: string;

  /** Datos retornados por el API, tipados según el contexto de la petición. */
  Datos?: T;

  /** Token JWT retornado al autenticar. Solo presente cuando aplica. */
  Token?: string;
}
