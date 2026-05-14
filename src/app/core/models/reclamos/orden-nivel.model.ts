export interface OrdenNivelRespuestaModel {
  idOrdenNivel: number;
  idNivelSuperior: number;
  idNivelInferior: number;
  idDepartamento: number;
  descripcionDepartamento: string;
  devolucionNivel: boolean;
}
