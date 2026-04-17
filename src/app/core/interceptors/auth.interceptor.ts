import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const auteticacionRequest = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(auteticacionRequest);
  }

  return next(request);
};
