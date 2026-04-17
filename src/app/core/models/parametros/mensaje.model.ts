/** Representa un mensaje configurado por pantalla en el sistema. */
export interface Mensaje {
  /** Identificador único del mensaje. */
  Id?: number;

  /** Número de pantalla a la que pertenece el mensaje. */
  Pantalla?: number;

  /** Texto del mensaje a mostrar. */
  Texto?: string;
}
