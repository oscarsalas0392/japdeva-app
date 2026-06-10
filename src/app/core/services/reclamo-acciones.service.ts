import { Injectable } from '@angular/core';
import { ReclamoRespuestaModel } from '../models/reclamos/reclamo.model';
import { OpcionAccionModel } from '../models/opcion-accion.model';
import { EstadoDetalleReclamoEnum } from '../models/reclamos/estado-detalle-reclamo.enum';

/**
 * Reglas de negocio sobre qué acciones puede realizar un usuario interno
 * sobre un reclamo, según su estado actual y el usuario que lo está mirando.
 *
 * Esto vive en un service (y no en el page) para que las reglas sean testables
 * de forma aislada y se puedan reutilizar desde otras pantallas que muestren
 * un listado de reclamos al usuario interno.
 */
@Injectable({ providedIn: 'root' })
export class ReclamoAccionesService {

  /**
   * Devuelve la lista de acciones disponibles para un reclamo desde la perspectiva
   * de un usuario interno.
   * @param reclamo Reclamo sobre el que se evalúan las acciones.
   * @param idUsuarioActual Usuario interno autenticado, para evaluar autoría.
   */
  opcionesUsuarioInterno(reclamo: ReclamoRespuestaModel, idUsuarioActual: number): OpcionAccionModel[] {
    const opciones: OpcionAccionModel[] = [
      { id: 'ver', etiqueta: 'inicio.acciones.ver' },
    ];

    if (reclamo.idEstadoDetalleReclamo === EstadoDetalleReclamoEnum.Pendiente) {
      opciones.push({ id: 'asignar', etiqueta: 'inicioUsuarioInterno.acciones.asignar' });
    }

    if (reclamo.idEstadoDetalleReclamo === EstadoDetalleReclamoEnum.EnProceso
        && reclamo.idUsuarioInterno === idUsuarioActual) {
      opciones.push({ id: 'atender', etiqueta: 'atenderReclamo.atender' });
    }

    return opciones;
  }
}
