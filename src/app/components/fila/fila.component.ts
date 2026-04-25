import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

export type TipoFila = 'campo' | 'menu';

@Component({
  selector: 'app-fila',
  templateUrl: './fila.component.html',
  styleUrls: ['./fila.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class FilaComponent {
  @Input() tipo: TipoFila = 'campo';
  @Input() borde = false;

  @HostBinding('style.border-bottom')
  get bordeEstilo() {
    return this.borde ? '1px solid var(--color-borde-input)' : null;
  }

  @HostBinding('style.display') readonly display = 'block';
  @Input() icono = '';
  @Input() etiqueta = '';
  @Input() valor = '';
  @Output() filaClick = new EventEmitter<void>();

  constructor() {
    addIcons({ chevronForwardOutline });
  }
}
