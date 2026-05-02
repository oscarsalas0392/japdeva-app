import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-boton-accion',
  templateUrl: './boton-accion.component.html',
  styleUrls: ['./boton-accion.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonIcon],
})
export class BotonAccionComponent {
  @Input() etiqueta = '';
  @Input() icono = 'add-circle-outline';
  @Input() tipo: 'outline' | 'solid' = 'outline';
  @Input() ancho: 'auto' | 'full' = 'auto';
  @Output() accion = new EventEmitter<void>();

  constructor() {
    addIcons({ addCircleOutline });
  }
}
