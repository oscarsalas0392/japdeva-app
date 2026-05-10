import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { funnelOutline } from 'ionicons/icons';

export interface ChipFiltro {
  id: number;
  etiqueta: string;
}

@Component({
  selector: 'app-chips-filtro',
  templateUrl: './chips-filtro.component.html',
  styleUrls: ['./chips-filtro.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ChipsFiltroComponent {
  @Input() filtros: ChipFiltro[] = [];
  @Input() activo = 0;
  @Output() filtroSeleccionado = new EventEmitter<number>();

  constructor() {
    addIcons({ funnelOutline });
  }
}
