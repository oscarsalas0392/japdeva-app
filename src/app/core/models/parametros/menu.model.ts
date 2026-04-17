/** Representa un ítem de menú asociado a un perfil. */
export interface Menu {
  /** Identificador único del menú. */
  Id?: number;

  /** Nombre visible del menú. */
  Nombre?: string;

  /** Ruta de navegación asociada al menú. */
  Ruta?: string;

  /** Nombre del ícono a mostrar. */
  Icono?: string;

  /** Orden de aparición dentro del menú. */
  Orden?: number;
}
