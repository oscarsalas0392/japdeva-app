import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, peopleOutline } from 'ionicons/icons';
import { LogoJapdevaComponent } from '../logo-japdeva/logo-japdeva.component';

@Component({
  selector: 'app-menu-usuario-interno',
  templateUrl: './menu-usuario-interno.component.html',
  styleUrls: ['./menu-usuario-interno.component.scss'],
  standalone: true,
  imports: [IonIcon, LogoJapdevaComponent],
})
export class MenuUsuarioInternoComponent {
  private readonly router   = inject(Router);
  private readonly menuCtrl = inject(MenuController);

  constructor() {
    addIcons({ personOutline, peopleOutline });
  }

  navegar(ruta: string): void {
    this.menuCtrl.close().then(() => {
      setTimeout(() => this.router.navigate([ruta]), 150);
    });
  }
}
