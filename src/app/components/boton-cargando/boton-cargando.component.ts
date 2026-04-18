import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-boton-cargando',
  templateUrl: './boton-cargando.component.html',
  styleUrls: ['./boton-cargando.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonButton, IonSpinner],
})
export class BotonCargandoComponent {
  @Input() etiqueta = '';
  @Input() cargando = false;
  @Input() deshabilitado = false;
  @Input() expand: 'block' | 'full' | undefined = 'block';
  @Input() color = 'primary';
  @Input() tipo: 'submit' | 'button' | 'reset' = 'submit';
}
