import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonItem, IonSelect, IonSelectOption, IonText } from '@ionic/angular/standalone';

export interface OpcionSelect {
  valor: number | string;
  etiqueta: string;
}

@Component({
  selector: 'app-campo-select',
  templateUrl: './campo-select.component.html',
  styleUrls: ['./campo-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, IonItem, IonSelect, IonSelectOption, IonText],
})
export class CampoSelectComponent {
  @Input() control!: AbstractControl;
  @Input() placeholder = '';
  @Input() mensajeError = '';
  @Input() enviado = false;
  @Input() opciones: OpcionSelect[] = [];

  enfocado = false;

  get invalido(): boolean {
    return this.control?.invalid && this.enviado;
  }
}
