import { Component, Output, EventEmitter } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-boton-nuevo-reclamo',
  templateUrl: './boton-nuevo-reclamo.component.html',
  styleUrls: ['./boton-nuevo-reclamo.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class BotonNuevoReclamoComponent {
  @Output() accion = new EventEmitter<void>();

  constructor() {
    addIcons({ addOutline });
  }
}
