import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-grupo-campo',
  templateUrl: './grupo-campo.component.html',
  styleUrls: ['./grupo-campo.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class GrupoCampoComponent {
  @Input() top = false;
  @Input() bottom = true;
}
