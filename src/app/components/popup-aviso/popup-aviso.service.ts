import { Injectable, signal } from '@angular/core';
import { TipoAviso } from '../aviso/aviso.component';

export type ModoPopup = 'alerta' | 'confirmacion';

export interface PopupConfig {
  tipo: TipoAviso;
  modo?: ModoPopup;
  titulo: string;
  mensaje: string;
  resolve?: (valor: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class PopupAvisoService {
  readonly config = signal<PopupConfig | null>(null);

  mostrar(config: Omit<PopupConfig, 'modo' | 'resolve'>): void {
    this.config.set({ ...config, modo: 'alerta' });
  }

  confirmar(config: Omit<PopupConfig, 'modo' | 'resolve'>): Promise<boolean> {
    return new Promise((resolve) => {
      this.config.set({ ...config, modo: 'confirmacion', resolve });
    });
  }

  cerrar(valor = false): void {
    this.config()?.resolve?.(valor);
    this.config.set(null);
  }
}
