import { Component, Input } from '@angular/core';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-overlay-cargando',
  templateUrl: './overlay-cargando.component.html',
  styleUrls: ['./overlay-cargando.component.scss'],
  standalone: true,
  imports: [IonSpinner],
})
export class OverlayCargandoComponent {
  @Input() cargando = false;
  @Input() mensaje = 'Cargando...';
}
