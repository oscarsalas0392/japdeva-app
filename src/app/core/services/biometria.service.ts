import { inject, Injectable } from '@angular/core';
import { NativeBiometric } from 'capacitor-native-biometric';
import { AlmacenamientoService } from './almacenamiento.service';
import { ClavesAlmacenamiento } from '../constants/claves-almacenamiento';

/** Identificador del "server" usado para indexar credenciales en el Keychain nativo. */
const SERVER_ID = 'japdeva_app';

export interface BiometriaDisponibilidad {
  disponible: boolean;
  esFaceId:   boolean;
}

export interface BiometriaCredenciales {
  correo:     string;
  contrasena: string;
}

/**
 * Servicio que encapsula toda la interacción con el plugin nativo de biometría
 * (huella / Face ID) y la persistencia del flag de activación.
 *
 * IMPORTANTE: los callbacks de NativeBiometric resuelven fuera de NgZone.
 * Los callers deben envolver las actualizaciones de estado/UI en `ngZone.run(...)`
 * cuando inviertan en signals o propiedades del componente después del await.
 */
@Injectable({ providedIn: 'root' })
export class BiometriaService {
  private readonly almacenamiento = inject(AlmacenamientoService);

  /** Indica si el usuario activó biometría en sesiones previas. */
  async estaHabilitada(): Promise<boolean> {
    const flag = await this.almacenamiento.obtener(ClavesAlmacenamiento.biometriaHabilitada);
    return flag === 'true';
  }

  /** Consulta al dispositivo si soporta biometría y qué tipo (Face ID / huella). */
  async disponibilidadDispositivo(): Promise<BiometriaDisponibilidad> {
    try {
      const result = await NativeBiometric.isAvailable();
      return { disponible: result.isAvailable, esFaceId: result.biometryType === 2 };
    } catch {
      return { disponible: false, esFaceId: false };
    }
  }

  /**
   * Combina la disponibilidad del dispositivo con la flag de activación del usuario.
   * Útil para decidir si mostrar el botón de huella en la pantalla de login.
   */
  async puedeUsarBiometria(): Promise<BiometriaDisponibilidad> {
    if (!(await this.estaHabilitada())) return { disponible: false, esFaceId: false };
    return this.disponibilidadDispositivo();
  }

  /**
   * Verifica identidad y devuelve las credenciales guardadas en el Keychain.
   * Lanza si el usuario cancela o si las credenciales no se encuentran.
   */
  async autenticar(razon: string, titulo: string): Promise<BiometriaCredenciales> {
    await NativeBiometric.verifyIdentity({ reason: razon, title: titulo });
    const credenciales = await NativeBiometric.getCredentials({ server: SERVER_ID });
    return { correo: credenciales.username, contrasena: credenciales.password };
  }

  /** Guarda las credenciales en el Keychain y marca la flag como habilitada. */
  async guardarCredenciales(correo: string, contrasena: string): Promise<void> {
    await NativeBiometric.setCredentials({ username: correo, password: contrasena, server: SERVER_ID });
    await this.almacenamiento.guardar(ClavesAlmacenamiento.biometriaHabilitada, 'true');
  }

  /** Borra credenciales del Keychain y la flag de activación. */
  async limpiar(): Promise<void> {
    await this.almacenamiento.eliminar(ClavesAlmacenamiento.biometriaHabilitada);
    await NativeBiometric.deleteCredentials({ server: SERVER_ID }).catch(() => {});
  }
}
