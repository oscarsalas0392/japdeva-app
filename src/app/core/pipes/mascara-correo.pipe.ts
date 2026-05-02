import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mascaraCorreo', standalone: true })
export class MascaraCorreoPipe implements PipeTransform {
  transform(correo: string | null | undefined): string {
    if (!correo) return '';

    const arroba = correo.indexOf('@');
    if (arroba < 0) return correo;

    const local  = correo.slice(0, arroba);
    const dominio = correo.slice(arroba);

    if (local.length <= 2) {
      return '*'.repeat(local.length) + dominio;
    }

    const visibleInicio = Math.min(2, local.length);
    const visibleFinal  = local.length > 4 ? 2 : 1;
    const mascaras      = Math.max(local.length - visibleInicio - visibleFinal, 2);

    return (
      local.slice(0, visibleInicio) +
      '*'.repeat(mascaras) +
      local.slice(local.length - visibleFinal) +
      dominio
    );
  }
}
