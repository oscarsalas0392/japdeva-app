/** Claves del estado global de la aplicación. */
export const ClavesEstado = {
  usuario:                  'usuario',
  menus:                    'menus',
  idRol:                    'idRol',
  usuarioRol:               'usuarioRol',
  departamentoUsuario:      'departamentoUsuario',
  departamentoReclamo:      'departamentoReclamo',
  terminosCondiciones:      'terminosCondiciones',
  informacionContacto:      'informacionContacto',
  rolDescripcion:           'rolDescripcion',
  departamentoDescripcion:  'departamentoDescripcion',
  ayudaUsuarioInterno:      'ayudaUsuarioInterno',
} as const;

export type ClaveEstado = typeof ClavesEstado[keyof typeof ClavesEstado];
