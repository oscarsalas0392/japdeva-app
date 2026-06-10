import { Component, ChangeDetectorRef, inject, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { EnlacesLoginComponent } from '../../components/enlaces-login/enlaces-login.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { CheckComponent } from '../../components/check/check.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { AuthService } from '../../core/services/auth.service';
import { SesionService } from '../../core/services/sesion.service';
import { BiometriaService } from '../../core/services/biometria.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { esRolInterno } from '../../core/constants/roles.constants';
import { AlmacenamientoService } from '../../core/services/almacenamiento.service';
import { ClavesAlmacenamiento } from '../../core/constants/claves-almacenamiento';
import { MascaraCorreoPipe } from '../../core/pipes/mascara-correo.pipe';

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
  private readonly authService    = inject(AuthService);
  private readonly sesionService  = inject(SesionService);
  private readonly biometria      = inject(BiometriaService);
  private readonly estadoService  = inject(EstadoAppService);
  private readonly router         = inject(Router);
  private readonly fb             = inject(FormBuilder);
  private readonly popup          = inject(PopupAvisoService);
  private readonly translate      = inject(TranslateService);
  private readonly ngZone         = inject(NgZone);
  private readonly cdr            = inject(ChangeDetectorRef);
  private readonly almacenamiento = inject(AlmacenamientoService);

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
    await this.cargarEstadoInicial();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarEstadoInicial();
  }

  private async cargarEstadoInicial(): Promise<void> {
    const guardado = await this.almacenamiento.obtener(ClavesAlmacenamiento.correoRecordado);
    this.correoGuardado = guardado ?? null;
    this.recordar = !!guardado;
    this.biometriaDisponible = false;
    if (this.correoGuardado) {
      const { disponible, esFaceId } = await this.biometria.puedeUsarBiometria();
      this.ngZone.run(() => {
        this.biometriaDisponible = disponible;
        this.esFaceId = esFaceId;
      });
    }
    this.cdr.detectChanges();
  }

  async autenticarConBiometria(): Promise<void> {
    this.cargandoBiometria = true;
    this.cdr.detectChanges();

    let credenciales;
    try {
      credenciales = await this.biometria.autenticar(
        this.translate.instant('inicioSesion.biometriaRazon'),
        this.translate.instant('inicioSesion.biometriaTitulo'),
      );
    } catch {
      // Usuario canceló o las credenciales no se encontraron.
      this.terminarCargandoBiometria();
      return;
    }

    // Los callbacks de NativeBiometric resuelven fuera de NgZone. Envolvemos el
    // resto del flujo para que los popups y la navegación disparen change detection.
    await this.ngZone.run(async () => {
      try {
        const respuesta = await this.authService.autenticar({
          Correo:     credenciales.correo,
          Contrasena: credenciales.contrasena,
        });

        if (!respuesta.Exito) {
          this.popup.mostrar({
            tipo: 'error',
            titulo: this.translate.instant('errores.titulo'),
            mensaje: respuesta.Mensaje || this.translate.instant('errores.credencialesInvalidas'),
          });
          return;
        }

        await this.estadoService.guardar(ClavesEstado.usuario, respuesta.Datos);
        await this.sesionService.inicializarSesion(respuesta.Datos!.id);
        await this.navegarSegunRol();
      } finally {
        this.terminarCargandoBiometria();
      }
    });
  }

  /** Termina el estado de carga y fuerza un ciclo de detección. */
  private terminarCargandoBiometria(): void {
    this.ngZone.run(() => {
      this.cargandoBiometria = false;
      this.cdr.detectChanges();
    });
  }

  private async ofrecerBiometria(correo: string, contrasena: string): Promise<void> {
    try {
      const { disponible } = await this.biometria.disponibilidadDispositivo();
      if (!disponible) return;
      if (await this.biometria.estaHabilitada()) return;

      const tipo = this.esFaceId
        ? this.translate.instant('inicioSesion.faceId')
        : this.translate.instant('inicioSesion.huella');

      const confirmado = await this.popup.confirmar({
        tipo: 'info',
        titulo: this.translate.instant('inicioSesion.biometriaTitulo'),
        mensaje: this.translate.instant('inicioSesion.biometriaMsg', { tipo }),
      });

      if (confirmado) {
        await this.biometria.guardarCredenciales(correo, contrasena);
      }
    } catch {
      // Ignorar errores al configurar biometría
    }
  }

  async editarCorreo(): Promise<void> {
    this.correoEditando      = true;
    this.biometriaDisponible = false;
    this.form.patchValue({ usuario: '' });

    // Limpiar correo guardado y credenciales del keychain
    // para que otro usuario no pueda ingresar con la huella del anterior
    await Promise.all([
      this.almacenamiento.eliminar(ClavesAlmacenamiento.correoRecordado),
      this.biometria.limpiar(),
    ]);
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
      await this.almacenamiento.guardar(ClavesAlmacenamiento.correoRecordado, correo);
    } else {
      await Promise.all([
        this.almacenamiento.eliminar(ClavesAlmacenamiento.correoRecordado),
        this.biometria.limpiar(),
      ]);
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
    await this.sesionService.inicializarSesion(respuesta.Datos!.id);

    if (this.recordar) {
      await this.ofrecerBiometria(correo, contrasena);
    }

    await this.navegarSegunRol();
  }

  private async navegarSegunRol(): Promise<void> {
    const idRol = await this.estadoService.obtener<number>(ClavesEstado.idRol);
    const ruta = esRolInterno(idRol) ? '/inicio-usuario-interno' : '/inicio';
    await this.router.navigate([ruta], { replaceUrl: true });
  }
}
