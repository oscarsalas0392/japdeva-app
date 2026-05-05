import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-campo-detalle',
  templateUrl: './campo-detalle.component.html',
  styleUrls: ['./campo-detalle.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class CampoDetalleComponent {
  @Input() titulo = '';
  @Input() valor = '';
}
