import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonDatetime, IonModal, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-campo-fecha',
  templateUrl: './campo-fecha.component.html',
  styleUrls: ['./campo-fecha.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, IonDatetime, IonModal, IonText, IonButton, IonIcon],
})
export class CampoFechaComponent {
  @Input() control!: AbstractControl;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() mensajeError = '';
  @Input() enviado = false;
  @Input() min = '';
  @Input() max = '';

  modalAbierto = false;
  valorTemp: string | null = null;

  constructor() {
    addIcons({ calendarOutline, closeOutline, checkmarkOutline });
  }

  get invalido(): boolean {
    return this.control?.invalid && this.enviado;
  }

  get valorFormateado(): string {
    const valor = this.control?.value;
    if (!valor) return '';
    const fecha = new Date(valor);
    if (isNaN(fecha.getTime())) return '';
    const dia  = String(fecha.getDate()).padStart(2, '0');
    const mes  = String(fecha.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${fecha.getFullYear()}`;
  }

  abrir(): void {
    this.valorTemp = this.control?.value ?? null;
    this.modalAbierto = true;
  }

  alCambiar(evento: CustomEvent): void {
    this.valorTemp = evento.detail.value as string;
  }

  confirmar(): void {
    if (this.valorTemp) {
      this.control?.setValue(this.valorTemp);
      this.control?.markAsDirty();
    }
    this.modalAbierto = false;
  }

  cancelar(): void {
    this.modalAbierto = false;
  }

  limpiar(e: Event): void {
    e.stopPropagation();
    this.control?.setValue(null);
    this.control?.markAsDirty();
  }
}
