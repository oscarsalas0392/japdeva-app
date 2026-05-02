import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonItem, IonSelect, IonSelectOption, IonText } from '@ionic/angular/standalone';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

@Component({
  selector: 'app-campo-select',
  templateUrl: './campo-select.component.html',
  styleUrls: ['./campo-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, IonItem, IonSelect, IonSelectOption, IonText],
})
export class CampoSelectComponent {
  @Input() control!: AbstractControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() mensajeError = '';
  @Input() enviado = false;
  @Input() requerido = false;
  @Input() hint = '';
  @Input() opciones: OpcionSelectModel[] = [];
  @Input() interfaz: 'action-sheet' | 'popover' | 'alert' = 'action-sheet';

  enfocado = false;

  get invalido(): boolean {
    return this.control?.invalid && this.enviado;
  }
}
