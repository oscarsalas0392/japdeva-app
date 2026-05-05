import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { EstadoReclamoEnum } from '../../core/models/reclamos/estado-reclamo.enum';

@Component({
  selector: 'app-item-reclamo',
  templateUrl: './item-reclamo.component.html',
  styleUrls: ['./item-reclamo.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ItemReclamoComponent {
  @Input() reclamo!: ReclamoRespuestaModel;
  @Output() seleccionar = new EventEmitter<ReclamoRespuestaModel>();

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  get codigo(): string {
    return `RC-${String(this.reclamo.id)}`;
  }

  get fechaFormateada(): string {
    const d = new Date(this.reclamo.fechaRegistro);
    if (isNaN(d.getTime())) return '';
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  get claseEstado(): string {
    switch (this.reclamo.idEstadoReclamo) {
      case EstadoReclamoEnum.Pendiente:  return 'estado--pendiente';
      case EstadoReclamoEnum.EnProceso:  return 'estado--en-proceso';
      case EstadoReclamoEnum.Completado: return 'estado--completado';
      case EstadoReclamoEnum.Rechazado:  return 'estado--rechazado';
      default:                           return 'estado--pendiente';
    }
  }
}
