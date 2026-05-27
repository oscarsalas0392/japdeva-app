/** Claves para persistencia local (Capacitor Preferences). */
export const ClavesAlmacenamiento = {
  token:             'token',
  correoRecordado:   'correo_recordado',
  biometriaHabilitada: 'biometria_habilitada',
} as const;

export type ClaveAlmacenamiento = typeof ClavesAlmacenamiento[keyof typeof ClavesAlmacenamiento];
