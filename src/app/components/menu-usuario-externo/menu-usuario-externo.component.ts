import { Component, computed, inject, signal } from '@angular/core';
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
import { MenusService } from '../../core/services/menus.service';
import { Menu } from '../../core/models/parametros/menu.model';

@Component({
  selector: 'app-menu-usuario-externo',
  templateUrl: './menu-usuario-externo.component.html',
  styleUrls: ['./menu-usuario-externo.component.scss'],
  standalone: true,
  imports: [IonIcon, LogoJapdevaComponent],
})
export class MenuUsuarioExternoComponent {
  private readonly router       = inject(Router);
  private readonly menuCtrl     = inject(MenuController);
  private readonly menusService = inject(MenusService);

  readonly parentesAbiertos = signal<Set<number>>(new Set());

  readonly itemsTopNivel = computed(() =>
    this.menusService.menus().filter(m => !m.idPadre)
  );

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

  hijos(idPadre: number): Menu[] {
    return this.menusService.menus().filter(m => m.idPadre === idPadre);
  }

  tieneHijos(id: number): boolean {
    return this.menusService.menus().some(m => m.idPadre === id);
  }

  toggleParent(id: number): void {
    this.parentesAbiertos.update(s => {
      const nuevo = new Set(s);
      if (nuevo.has(id)) nuevo.delete(id); else nuevo.add(id);
      return nuevo;
    });
  }

  estaAbierto(id: number): boolean {
    return this.parentesAbiertos().has(id);
  }

  navegar(ruta: string): void {
    this.menuCtrl.close().then(() => {
      setTimeout(() => this.router.navigate([ruta]), 150);
    });
  }
}
