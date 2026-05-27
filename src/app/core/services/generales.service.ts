import { Injectable } from '@angular/core';
import { EstadoReclamoEnum } from '../models/reclamos/estado-reclamo.enum';
import { EstadoDetalleReclamoEnum } from '../models/reclamos/estado-detalle-reclamo.enum';

@Injectable({ providedIn: 'root' })
export class GeneralesService {

  private readonly MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  formatearFecha(iso: string | null | undefined, formato: 'largo' | 'corto' = 'largo'): string {
    if (!iso) return '';
    const fecha = new Date(iso);
    if (isNaN(fecha.getTime())) return '';
    if (formato === 'corto') {
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      return `${dia}/${mes}/${fecha.getFullYear()}`;
    }
    return `${fecha.getDate()} ${this.MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
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
      case EstadoDetalleReclamoEnum.Devuelto: return 'estado--devuelto';
      default:                           return 'estado--pendiente';
    }
  }
}
