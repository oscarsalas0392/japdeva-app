import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';
import { NativeBiometric } from 'capacitor-native-biometric';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { EnlacesLoginComponent } from '../../components/enlaces-login/enlaces-login.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { CheckComponent } from '../../components/check/check.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { AuthService } from '../../core/services/auth.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { MascaraCorreoPipe } from '../../core/pipes/mascara-correo.pipe';

const CLAVE_CORREO    = 'correo_recordado';
const CLAVE_BIOMETRIA = 'biometria_habilitada';
const SERVER_ID       = 'japdeva_app';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MascaraCorreoPipe,
    IonContent, IonCard, IonCardContent, IonIcon, IonSpinner,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    GrupoCampoComponent,
    EnlacesLoginComponent,
    BotonCargandoComponent,
    CheckComponent,
  ],
})
export class InicioSesionPage implements OnInit {
  private readonly authService   = inject(AuthService);
  private readonly estadoService = inject(EstadoAppService);
  private readonly router        = inject(Router);
  private readonly fb            = inject(FormBuilder);
  private readonly popup         = inject(PopupAvisoService);
  private readonly translate     = inject(TranslateService);

  readonly form = this.fb.group({
    usuario:    ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  cargando              = false;
  enviado               = false;
  recordar              = false;
  correoGuardado: string | null = null;
  correoEditando        = false;
  biometriaDisponible   = false;
  esFaceId              = false;
  cargandoBiometria     = false;

  constructor() {
    addIcons({ fingerPrintOutline });
  }

  async ngOnInit(): Promise<void> {
    const guardado = localStorage.getItem(CLAVE_CORREO);
    if (guardado) {
      this.correoGuardado = guardado;
      this.recordar = true;
    }
    await this.verificarBiometria();
  }

  private async verificarBiometria(): Promise<void> {
    if (!this.correoGuardado) return;
    if (localStorage.getItem(CLAVE_BIOMETRIA) !== 'true') return;

    try {
      const result = await NativeBiometric.isAvailable();
      if (result.isAvailable) {
        this.biometriaDisponible = true;
        this.esFaceId = result.biometryType === 2; // FaceID = 2
      }
    } catch {
      this.biometriaDisponible = false;
    }
  }

  async autenticarConBiometria(): Promise<void> {
    this.cargandoBiometria = true;

    // 1. Verificar identidad — si el usuario cancela, salir silenciosamente
    try {
      await NativeBiometric.verifyIdentity({
        reason: this.translate.instant('inicioSesion.biometriaRazon'),
        title:  this.translate.instant('inicioSesion.biometriaTitulo'),
      });
    } catch {
      this.cargandoBiometria = false;
      return;
    }

    // 2. Recuperar credenciales y autenticar
    try {
      const credenciales = await NativeBiometric.getCredentials({ server: SERVER_ID });

      const respuesta = await this.authService.autenticar({
        Correo:     credenciales.username,
        Contrasena: credenciales.password,
      });

      if (!respuesta.Exito) {
        this.popup.mostrar({
          tipo: 'error',
          titulo: this.translate.instant('errores.titulo'),
          mensaje: this.translate.instant('errores.credencialesInvalidas'),
        });
        return;
      }

      await this.estadoService.guardar(ClavesEstado.usuario, respuesta.Datos);
      await this.router.navigate(['/inicio'], { replaceUrl: true });

    } catch {
      // Las credenciales no se encontraron — limpiar biometría y pedir contraseña
      localStorage.removeItem(CLAVE_BIOMETRIA);
      NativeBiometric.deleteCredentials({ server: SERVER_ID }).catch(() => {});
      this.biometriaDisponible = false;
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: 'No se pudieron recuperar las credenciales. Ingrese su contraseña.',
      });
    } finally {
      this.cargandoBiometria = false;
    }
  }

  private async ofrecerBiometria(correo: string, contrasena: string): Promise<void> {
    try {
      const result = await NativeBiometric.isAvailable();
      if (!result.isAvailable) return;
      if (localStorage.getItem(CLAVE_BIOMETRIA) === 'true') return;

      const tipo = this.esFaceId
        ? this.translate.instant('inicioSesion.faceId')
        : this.translate.instant('inicioSesion.huella');

      const confirmado = await this.popup.confirmar({
        tipo: 'info',
        titulo: this.translate.instant('inicioSesion.biometriaTitulo'),
        mensaje: this.translate.instant('inicioSesion.biometriaMsg', { tipo }),
      });

      if (confirmado) {
        // Guardar credenciales en keychain nativo del dispositivo
        await NativeBiometric.setCredentials({
          username: correo,
          password: contrasena,
          server:   SERVER_ID,
        });
        localStorage.setItem(CLAVE_BIOMETRIA, 'true');
      }
    } catch {
      // Ignorar errores al configurar biometría
    }
  }

  editarCorreo(): void {
    this.correoEditando    = true;
    this.biometriaDisponible = false;
    this.form.patchValue({ usuario: '' });

    // Limpiar correo guardado y credenciales del keychain
    // para que otro usuario no pueda ingresar con la huella del anterior
    localStorage.removeItem(CLAVE_CORREO);
    localStorage.removeItem(CLAVE_BIOMETRIA);
    NativeBiometric.deleteCredentials({ server: SERVER_ID }).catch(() => {});
  }

  async enviar(): Promise<void> {
    this.enviado = true;

    const usandoGuardado = !!this.correoGuardado && !this.correoEditando;
    if (!usandoGuardado && this.form.get('usuario')!.invalid) return;
    if (this.form.get('contrasena')!.invalid) return;

    this.cargando = true;
    this.form.disable();

    const correo = usandoGuardado
      ? this.correoGuardado!
      : this.form.getRawValue().usuario!;
    const contrasena = this.form.getRawValue().contrasena!;

    if (this.recordar) {
      localStorage.setItem(CLAVE_CORREO, correo);
    } else {
      localStorage.removeItem(CLAVE_CORREO);
      localStorage.removeItem(CLAVE_BIOMETRIA);
      await NativeBiometric.deleteCredentials({ server: SERVER_ID }).catch(() => {});
    }

    const respuesta = await this.authService.autenticar({
      Correo:     correo,
      Contrasena: contrasena,
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje || this.translate.instant('errores.credencialesInvalidas'),
      });
      return;
    }

    await this.estadoService.guardar(ClavesEstado.usuario, respuesta.Datos);

    if (this.recordar) {
      await this.ofrecerBiometria(correo, contrasena);
    }

    await this.router.navigate(['/inicio'], { replaceUrl: true });
  }
}
