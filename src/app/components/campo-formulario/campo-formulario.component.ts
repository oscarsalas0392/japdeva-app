import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonItem, IonInput, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-campo-formulario',
  templateUrl: './campo-formulario.component.html',
  styleUrls: ['./campo-formulario.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, IonItem, IonInput, IonText, IonButton, IonIcon],
})
export class CampoFormularioComponent {
  @Input() control!: AbstractControl;
  @Input() tipo: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() mensajeError = '';
  @Input() enviado = false;
  @Input() requerido = false;
  @Input() hint = '';
  @Input() valor = '';
  @Input() soloLectura = false;

  enfocado = false;
  mostrarContrasena = false;

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  get esContrasena(): boolean {
    return this.tipo === 'password';
  }

  get tipoActual(): string {
    return this.esContrasena && this.mostrarContrasena ? 'text' : this.tipo;
  }

  get invalido(): boolean {
    return this.control?.invalid && this.enviado;
  }
}
