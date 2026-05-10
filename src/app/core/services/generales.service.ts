import { Injectable } from '@angular/core';
import { EstadoReclamoEnum } from '../models/reclamos/estado-reclamo.enum';

@Injectable({ providedIn: 'root' })
export class GeneralesService {

  private readonly MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  formatearFecha(iso: string | null | undefined, formato: 'largo' | 'corto' = 'largo'): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    if (formato === 'corto') {
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      return `${dia}/${mes}/${d.getFullYear()}`;
    }
    return `${d.getDate()} ${this.MESES[d.getMonth()]} ${d.getFullYear()}`;
  }

  codigoReclamo(id: number, fechaRegistro: string): string {
    const year = fechaRegistro ? new Date(fechaRegistro).getFullYear() : new Date().getFullYear();
    return `RC-${year}-${String(id).padStart(4, '0')}`;
  }

  claseEstadoReclamo(idEstado: number): string {
    switch (idEstado) {
      case EstadoReclamoEnum.Pendiente:  return 'estado--pendiente';
      case EstadoReclamoEnum.EnProceso:  return 'estado--en-proceso';
      case EstadoReclamoEnum.Completado: return 'estado--completado';
      case EstadoReclamoEnum.Rechazado:  return 'estado--rechazado';
      default:                           return 'estado--pendiente';
    }
  }
}
