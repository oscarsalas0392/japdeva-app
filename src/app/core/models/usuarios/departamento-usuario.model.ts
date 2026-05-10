/** Datos de la asignación de un usuario a un departamento. */
export interface DepartamentoUsuarioRespuestaModel {
  id: number;
  idUsuario: number;
  idDepartamento: number;
  idUsuarioAdministrador: number;
  fechaRegistro: string;
  activo: boolean;
}
