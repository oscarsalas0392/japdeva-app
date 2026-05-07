import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-columnas',
  templateUrl: './grid-columnas.component.html',
  styleUrls: ['./grid-columnas.component.scss'],
  standalone: true,
})
export class GridColumnasComponent {
  @Input() columnas = 2;
  @Input() gap = '12px';
}
