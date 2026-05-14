import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemReclamoComponent } from '../item-reclamo/item-reclamo.component';
import { ItemSeleccionableComponent } from '../item-seleccionable/item-seleccionable.component';
import { EstadoVacioComponent } from '../estado-vacio/estado-vacio.component';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss'],
  standalone: true,
  imports: [ItemReclamoComponent, ItemSeleccionableComponent, EstadoVacioComponent],
})
export class ListaReclamosComponent {
  @Input() reclamos: ReclamoRespuestaModel[] = [];
  @Input() opciones: OpcionAccionModel[] = [];
  @Input() cargando = false;
  @Input() mostrarConteo = false;
  @Input() tituloVacio = 'buscar.sinResultados';
  @Input() subtituloVacio = 'buscar.sinResultadosDesc';
  @Input() etiquetaBotonVacio = '';
  @Input() mostrarEstadoDetalle = false;
  @Output() accion = new EventEmitter<{ accionId: string; reclamo: ReclamoRespuestaModel }>();
  @Output() accionVacio = new EventEmitter<void>();
}
