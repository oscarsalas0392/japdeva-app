/** Claves del estado global de la aplicación. */
export const ClavesEstado = {
  usuario: 'usuario',
  menus:   'menus',
  idRol:   'idRol',
} as const;

export type ClaveEstado = typeof ClavesEstado[keyof typeof ClavesEstado];
