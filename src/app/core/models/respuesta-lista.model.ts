/** Modelo genérico de respuesta paginada del API Gateway. */
export interface RespuestaListaModel<T> {
  /** Número total de registros disponibles. */
  TotalRegistros: number;

  /** Cantidad total de páginas según el tamaño de página configurado. */
  CantidadPaginas: number;

  /** Número de la página actual. */
  PaginaActual: number;

  /** Lista de elementos retornados en la página actual. */
  Lista: T[];
}
