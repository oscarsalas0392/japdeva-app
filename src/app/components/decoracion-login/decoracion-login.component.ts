import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-decoracion-login',
  templateUrl: './decoracion-login.component.html',
  styleUrls: ['./decoracion-login.component.scss'],
  standalone: true,
  imports: [],
})
export class DecoracionLoginComponent {
  @Input() posicion: 'top' | 'bottom' = 'top';
}
