import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ClaveAlmacenamiento } from '../constants/claves-almacenamiento';

/**
 * Servicio de persistencia local respaldado por Capacitor Preferences.
 * En Android usa SharedPreferences, en iOS UserDefaults, en web cae a localStorage.
 * Centraliza el acceso para que las claves estén tipadas y un futuro cambio de backend
 * (por ejemplo, secure storage cifrado) afecte un solo archivo.
 */
@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {

  async obtener(clave: ClaveAlmacenamiento): Promise<string | null> {
    const { value } = await Preferences.get({ key: clave });
    return value;
  }

  async guardar(clave: ClaveAlmacenamiento, valor: string): Promise<void> {
    await Preferences.set({ key: clave, value: valor });
  }

  async eliminar(clave: ClaveAlmacenamiento): Promise<void> {
    await Preferences.remove({ key: clave });
  }

  async limpiar(): Promise<void> {
    await Preferences.clear();
  }
}
