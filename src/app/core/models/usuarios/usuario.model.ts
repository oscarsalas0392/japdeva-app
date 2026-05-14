/** Datos completos de un usuario del sistema. */
export interface UsuarioRespuestaModel {
  id: number;
  identificacion: string;
  idTipoCedula: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  fechaRegistro: string;
  fechaEdicion?: string;
  activo: boolean;
}
