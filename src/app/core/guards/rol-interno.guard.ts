import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EstadoAppService } from '../state/app.service';
import { ClavesEstado } from '../state/claves-estado';
import { esRolInterno } from '../constants/roles.constants';

/**
 * Restringe el acceso a pantallas de usuario interno (empleado JAPDEVA).
 * Si el usuario es externo, lo redirige a su inicio.
 */
export const rolInternoGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const estado = inject(EstadoAppService);

  const idRol = await estado.obtener<number>(ClavesEstado.idRol);
  if (esRolInterno(idRol)) return true;

  return router.createUrlTree(['/inicio']);
};
