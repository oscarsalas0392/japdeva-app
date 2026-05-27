import { Injectable, signal } from '@angular/core';
import { Menu } from '../models/parametros/menu.model';

@Injectable({ providedIn: 'root' })
export class MenusService {
  private readonly _menus = signal<Menu[]>([]);
  readonly menus = this._menus.asReadonly();

  establecer(menus: Menu[]): void {
    this._menus.set(menus);
  }

  limpiar(): void {
    this._menus.set([]);
  }
}
