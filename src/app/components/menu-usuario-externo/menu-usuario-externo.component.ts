import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  documentTextOutline,
  addCircleOutline,
  searchOutline,
  informationCircleOutline,
  chevronUpOutline,
  chevronDownOutline,
} from 'ionicons/icons';
import { LogoJapdevaComponent } from '../logo-japdeva/logo-japdeva.component';

@Component({
  selector: 'app-menu-usuario-externo',
  templateUrl: './menu-usuario-externo.component.html',
  styleUrls: ['./menu-usuario-externo.component.scss'],
  standalone: true,
  imports: [IonIcon, LogoJapdevaComponent],
})
export class MenuUsuarioExternoComponent {
  private readonly router   = inject(Router);
  private readonly menuCtrl = inject(MenuController);

  readonly reclamosAbierto = signal(false);

  constructor() {
    addIcons({
      personOutline,
      documentTextOutline,
      addCircleOutline,
      searchOutline,
      informationCircleOutline,
      chevronUpOutline,
      chevronDownOutline,
    });
  }

  toggleReclamos(): void {
    this.reclamosAbierto.update(v => !v);
  }

  navegar(ruta: string): void {
    this.menuCtrl.close().then(() => {
      setTimeout(() => this.router.navigate([ruta]), 150);
    });
  }
}
