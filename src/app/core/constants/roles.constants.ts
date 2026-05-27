/** Identificadores de roles que corresponden a usuarios internos (empleados JAPDEVA). */
export const ROLES_INTERNOS: readonly number[] = [1, 2, 3];

/** Determina si un identificador de rol corresponde a un usuario interno. */
export function esRolInterno(idRol: number | null | undefined): boolean {
  return !!idRol && ROLES_INTERNOS.includes(idRol);
}
