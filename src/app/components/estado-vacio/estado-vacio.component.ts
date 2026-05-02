import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline } from 'ionicons/icons';
import { TarjetaComponent } from '../tarjeta/tarjeta.component';
import { BotonAccionComponent } from '../boton-accion/boton-accion.component';

@Component({
  selector: 'app-estado-vacio',
  templateUrl: './estado-vacio.component.html',
  styleUrls: ['./estado-vacio.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonIcon, TarjetaComponent, BotonAccionComponent],
})
export class EstadoVacioComponent {
  @Input() icono = 'document-outline';
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() etiquetaBoton = '';
  @Input() iconoBoton = 'add-outline';
  @Output() accion = new EventEmitter<void>();

  constructor() {
    addIcons({ documentOutline });
  }
}
