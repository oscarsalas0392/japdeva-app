/** Datos de la asignación de un rol a un usuario. */
export interface UsuarioRolRespuestaModel {
  id: number;
  idUsuario: number;
  idRol: number;
  fechaRegistro: string;
  activo: boolean;
}
