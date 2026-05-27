import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EstadoAppService } from '../state/app.service';
import { ClavesEstado } from '../state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../models/usuarios/auth-response.model';
import { AlmacenamientoService } from '../services/almacenamiento.service';
import { ClavesAlmacenamiento } from '../constants/claves-almacenamiento';

/**
 * Permite el acceso solo a usuarios autenticados (token + usuario en estado).
 * Redirige a /inicio-sesion si falta cualquiera de los dos.
 */
export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const estado = inject(EstadoAppService);
  const almacenamiento = inject(AlmacenamientoService);

  const [token, usuario] = await Promise.all([
    almacenamiento.obtener(ClavesAlmacenamiento.token),
    estado.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario),
  ]);

  if (token && usuario) return true;

  await Promise.all([
    almacenamiento.eliminar(ClavesAlmacenamiento.token),
    estado.limpiar(),
  ]);
  return router.createUrlTree(['/inicio-sesion']);
};
