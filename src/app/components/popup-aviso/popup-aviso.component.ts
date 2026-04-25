import { Component, inject } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  informationCircleOutline,
  closeOutline,
} from 'ionicons/icons';
import { TipoAviso } from '../aviso/aviso.component';
import { PopupAvisoService } from './popup-aviso.service';

@Component({
  selector: 'app-popup-aviso',
  templateUrl: './popup-aviso.component.html',
  styleUrls: ['./popup-aviso.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton],
})
export class PopupAvisoComponent {
  readonly popupService = inject(PopupAvisoService);

  private readonly iconos: Record<TipoAviso, string> = {
    exito:       'checkmark-circle-outline',
    error:       'alert-circle-outline',
    advertencia: 'alert-circle-outline',
    info:        'information-circle-outline',
  };

  constructor() {
    addIcons({ checkmarkCircleOutline, alertCircleOutline, informationCircleOutline, closeOutline });
  }

  get config() {
    return this.popupService.config();
  }

  get icono(): string {
    return this.config ? this.iconos[this.config.tipo] : '';
  }

  cerrar(valor = false): void {
    this.popupService.cerrar(valor);
  }
}
