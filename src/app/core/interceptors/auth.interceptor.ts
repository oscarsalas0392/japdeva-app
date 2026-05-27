import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { AlmacenamientoService } from '../services/almacenamiento.service';
import { ClavesAlmacenamiento } from '../constants/claves-almacenamiento';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const almacenamiento = inject(AlmacenamientoService);

  return from(almacenamiento.obtener(ClavesAlmacenamiento.token)).pipe(
    switchMap(token => {
      if (token) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }
      return next(request);
    })
  );
};
