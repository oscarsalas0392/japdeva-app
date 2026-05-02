import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-campo-textarea',
  templateUrl: './campo-textarea.component.html',
  styleUrls: ['./campo-textarea.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, IonText],
})
export class CampoTextareaComponent {
  @Input() control!: AbstractControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() mensajeError = '';
  @Input() enviado = false;
  @Input() filas = 5;
  @Input() maxLength = 1000;
  @Input() requerido = false;
  @Input() hint = '';

  enfocado = false;

  get invalido(): boolean {
    return this.control?.invalid && this.enviado;
  }

  get caracteresRestantes(): number {
    return this.maxLength - (this.control?.value?.length ?? 0);
  }
}
