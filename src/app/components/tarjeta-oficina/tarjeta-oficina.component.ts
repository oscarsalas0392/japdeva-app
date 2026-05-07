import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tarjeta-oficina',
  templateUrl: './tarjeta-oficina.component.html',
  styleUrls: ['./tarjeta-oficina.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class TarjetaOficinaComponent {
  @Input() nombre = '';
  @Input() direccion = '';
  @Input() horario = '';

  constructor() {
    addIcons({ locationOutline, timeOutline });
  }
}
