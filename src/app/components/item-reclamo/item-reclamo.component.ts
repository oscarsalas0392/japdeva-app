import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { GeneralesService } from '../../core/services/generales.service';

@Component({
  selector: 'app-item-reclamo',
  templateUrl: './item-reclamo.component.html',
  styleUrls: ['./item-reclamo.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ItemReclamoComponent {
  @Input() reclamo!: ReclamoRespuestaModel;
  @Input() mostrarEstadoDetalle = false;
  @Output() seleccionar = new EventEmitter<ReclamoRespuestaModel>();

  private readonly generales = inject(GeneralesService);

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  get codigo(): string {
    return this.generales.codigoReclamo(this.reclamo.id, this.reclamo.fechaRegistro);
  }

  get fechaFormateada(): string {
    return this.generales.formatearFecha(this.reclamo.fechaRegistro);
  }

  get claseEstado(): string {
    return this.generales.claseEstadoReclamo(this.reclamo.idEstadoReclamo);
  }
}
