import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { callOutline, mailOutline, locationOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tarjeta-contacto',
  templateUrl: './tarjeta-contacto.component.html',
  styleUrls: ['./tarjeta-contacto.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class TarjetaContactoComponent {
  @Input() icono = '';
  @Input() etiqueta = '';
  @Input() valor = '';

  constructor() {
    addIcons({ callOutline, mailOutline, locationOutline, timeOutline });
  }
}
