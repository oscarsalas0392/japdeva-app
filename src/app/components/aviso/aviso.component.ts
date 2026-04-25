import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  warningOutline,
  informationCircleOutline,
} from 'ionicons/icons';

export type TipoAviso = 'exito' | 'error' | 'advertencia' | 'info';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslateModule],
})
export class AvisoComponent {
  @Input() tipo: TipoAviso = 'info';
  @Input() mensaje = '';
  @Input() titulo = '';
  @Input() items: string[] = [];

  private readonly iconos: Record<TipoAviso, string> = {
    exito:      'checkmark-circle-outline',
    error:      'alert-circle-outline',
    advertencia:'warning-outline',
    info:       'information-circle-outline',
  };

  constructor() {
    addIcons({ checkmarkCircleOutline, alertCircleOutline, warningOutline, informationCircleOutline });
  }

  get icono(): string {
    return this.iconos[this.tipo];
  }
}
