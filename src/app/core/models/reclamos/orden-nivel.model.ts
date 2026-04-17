/** Datos de un nivel dentro del flujo jerárquico de procesos de reclamo. */
export interface OrdenNivelRespuestaModel {
  /** Identificador único del orden de nivel. */
  IdOrdenNivel: number;

  /** Identificador del nivel superior (padre) en la jerarquía de procesos. */
  IdNivelSuperior: number;

  /** Identificador del nivel inferior (hijo) en la jerarquía de procesos. */
  IdNivelInferior: number;

  /** Identificador del departamento responsable de este nivel. */
  IdDepartamento: number;

  /** Descripción del departamento responsable del nivel de proceso. */
  DescripcionDepartamento: string;

  /** Indica si este nivel permite realizar devoluciones en el proceso. */
  DevolucionNivel: boolean;
}
