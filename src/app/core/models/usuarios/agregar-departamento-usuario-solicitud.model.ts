/** Datos requeridos para asignar un usuario a un departamento. */
export interface AgregarDepartamentoUsuarioSolicitudModel {
  /** Identificador del usuario a asignar. */
  IdUsuario: number;

  /** Identificador del departamento destino. */
  IdDepartamento: number;

  /** Identificador del administrador que realiza la asignación. */
  IdUsuarioAdministrador: number;
}
