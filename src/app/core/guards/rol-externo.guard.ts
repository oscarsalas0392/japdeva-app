import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EstadoAppService } from '../state/app.service';
import { ClavesEstado } from '../state/claves-estado';
import { esRolInterno } from '../constants/roles.constants';

/**
 * Restringe el acceso a pantallas de usuario externo (cliente).
 * Si el usuario es interno, lo redirige a su inicio.
 */
export const rolExternoGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const estado = inject(EstadoAppService);

  const idRol = await estado.obtener<number>(ClavesEstado.idRol);
  if (!esRolInterno(idRol)) return true;

  return router.createUrlTree(['/inicio-usuario-interno']);
};
