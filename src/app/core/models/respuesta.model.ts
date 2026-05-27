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

  /**
   * Marca que el error ya fue notificado al usuario por una capa superior
   * (por ejemplo, ApiService mostró el popup y disparó la expulsión de sesión).
   * Los callers deben omitir su propio popup cuando esta bandera esté en true.
   */
  Manejado?: boolean;
}
