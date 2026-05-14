import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslateModule],
})
export class TarjetaComponent {
  @Input() padding = true;
  @Input() titulo  = '';
  @Input() icono   = '';
}
