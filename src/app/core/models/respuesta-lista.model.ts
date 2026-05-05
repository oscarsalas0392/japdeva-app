/** Modelo genérico de respuesta paginada del API Gateway. */
export interface RespuestaListaModel<T> {
  totalRegistros: number;
  cantidadPaginas: number;
  paginaActual: number;
  lista: T[];
}
