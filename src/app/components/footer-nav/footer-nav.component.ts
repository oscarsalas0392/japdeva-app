import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personOutline,
  menuOutline,
  documentTextOutline,
  searchOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonIcon],
})
export class FooterNavComponent {
  private readonly menuCtrl = inject(MenuController);

  constructor() {
    addIcons({ homeOutline, personOutline, menuOutline, documentTextOutline, searchOutline });
  }

  async abrirMenu(): Promise<void> {
    await this.menuCtrl.open();
  }
}
