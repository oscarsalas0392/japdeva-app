import { Component, ChangeDetectorRef, inject, NgZone, OnInit } from '@angular/core';
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
import { UsuariosService } from '../../core/services/usuarios.service';
import { ParametrosService } from '../../core/services/parametros.service';
import { MenusService } from '../../core/services/menus.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { esRolInterno } from '../../core/constants/roles.constants';
import { AlmacenamientoService } from '../../core/services/almacenamiento.service';
import { ClavesAlmacenamiento } from '../../core/constants/claves-almacenamiento';
import { MascaraCorreoPipe } from '../../core/pipes/mascara-correo.pipe';

const SERVER_ID = 'japdeva_app';

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
  private readonly authService      = inject(AuthService);
  private readonly usuariosService  = inject(UsuariosService);
  private readonly parametrosService = inject(ParametrosService);
  private readonly menusService     = inject(MenusService);
  private readonly estadoService    = inject(EstadoAppService);
  private readonly router           = inject(Router);
  private readonly fb               = inject(FormBuilder);
  private readonly popup            = inject(PopupAvisoService);
  private readonly translate        = inject(TranslateService);
  private readonly ngZone           = inject(NgZone);
  private readonly cdr              = inject(ChangeDetectorRef);
  private readonly almacenamiento   = inject(AlmacenamientoService);

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
    await this.verificarBiometria();
    this.cdr.detectChanges();
  }

  private async verificarBiometria(): Promise<void> {
    if (!this.correoGuardado) return;
    const biometria = await this.almacenamiento.obtener(ClavesAlmacenamiento.biometriaHabilitada);
    if (biometria !== 'true') return;

    try {
      const result = await NativeBiometric.isAvailable();
      this.ngZone.run(() => {
        this.biometriaDisponible = result.isAvailable;
        this.esFaceId = result.biometryType === 2;
      });
    } catch {
      this.ngZone.run(() => { this.biometriaDisponible = false; });
    }
  }

  async autenticarConBiometria(): Promise<void> {
    this.cargandoBiometria = true;
    this.cdr.detectChanges();

    // 1. Verificar identidad — si el usuario cancela, salir silenciosamente
    try {
      await NativeBiometric.verifyIdentity({
        reason: this.translate.instant('inicioSesion.biometriaRazon'),
        title:  this.translate.instant('inicioSesion.biometriaTitulo'),
      });
    } catch {
      this.terminarCargandoBiometria();
      return;
    }

    // 2. Recuperar credenciales y autenticar — todo el bloque debe correr en NgZone
    // porque los callbacks de NativeBiometric resuelven fuera de la zona de Angular,
    // lo que dejaría el spinner activo y los popups invisibles.
    await this.ngZone.run(async () => {
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
            mensaje: respuesta.Mensaje || this.translate.instant('errores.credencialesInvalidas'),
          });
          return;
        }

        await this.estadoService.guardar(ClavesEstado.usuario, respuesta.Datos);
        await this.guardarRol(respuesta.Datos!.id);
        await this.navegarSegunRol();

      } catch {
        // Las credenciales no se encontraron — limpiar biometría y pedir contraseña
        await this.almacenamiento.eliminar(ClavesAlmacenamiento.biometriaHabilitada);
        NativeBiometric.deleteCredentials({ server: SERVER_ID }).catch(() => {});
        this.biometriaDisponible = false;
        this.popup.mostrar({
          tipo: 'error',
          titulo: this.translate.instant('errores.titulo'),
          mensaje: 'No se pudieron recuperar las credenciales. Ingrese su contraseña.',
        });
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
      const result = await NativeBiometric.isAvailable();
      if (!result.isAvailable) return;
      const biometria = await this.almacenamiento.obtener(ClavesAlmacenamiento.biometriaHabilitada);
      if (biometria === 'true') return;

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
        await this.almacenamiento.guardar(ClavesAlmacenamiento.biometriaHabilitada, 'true');
      }
    } catch {
      // Ignorar errores al configurar biometría
    }
  }

  async editarCorreo(): Promise<void> {
    this.correoEditando    = true;
    this.biometriaDisponible = false;
    this.form.patchValue({ usuario: '' });

    // Limpiar correo guardado y credenciales del keychain
    // para que otro usuario no pueda ingresar con la huella del anterior
    await Promise.all([
      this.almacenamiento.eliminar(ClavesAlmacenamiento.correoRecordado),
      this.almacenamiento.eliminar(ClavesAlmacenamiento.biometriaHabilitada),
    ]);
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
      await this.almacenamiento.guardar(ClavesAlmacenamiento.correoRecordado, correo);
    } else {
      await Promise.all([
        this.almacenamiento.eliminar(ClavesAlmacenamiento.correoRecordado),
        this.almacenamiento.eliminar(ClavesAlmacenamiento.biometriaHabilitada),
      ]);
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
    await this.guardarRol(respuesta.Datos!.id);

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

  private async guardarRol(idUsuario: number): Promise<void> {
    try {
      const [rolRespuesta, departamentoRespuesta] = await Promise.all([
        this.usuariosService.obtenerRolPorUsuario(idUsuario),
        this.usuariosService.obtenerDepartamentoPorUsuario(idUsuario),
      ]);

      const usuarioRol = rolRespuesta.Exito && rolRespuesta.Datos ? rolRespuesta.Datos : null;
      const idRol = usuarioRol?.idRol ?? null;
      const deptUsuario = departamentoRespuesta.Exito && departamentoRespuesta.Datos
        ? departamentoRespuesta.Datos : null;

      await Promise.all([
        this.estadoService.guardar(ClavesEstado.usuarioRol, usuarioRol),
        this.estadoService.guardar(ClavesEstado.idRol, idRol),
        deptUsuario ? this.estadoService.guardar(ClavesEstado.departamentoUsuario, deptUsuario) : Promise.resolve(),
      ]);

      const tareas: Promise<void>[] = [];
      if (idRol) {
        tareas.push(this.cachearDescripcionRol(idRol));
        tareas.push(this.cargarMenus(idRol));
      }
      if (deptUsuario?.idDepartamento) {
        tareas.push(this.cachearDescripcionDepartamento(deptUsuario.idDepartamento));
      }
      await Promise.all(tareas);
    } catch {
      // Si falla, no bloquear el login
    }
  }

  private async cachearDescripcionRol(idRol: number): Promise<void> {
    try {
      const respuesta = await this.usuariosService.obtenerRolPorId(idRol);
      if (respuesta.Exito && respuesta.Datos) {
        await this.estadoService.guardar(ClavesEstado.rolDescripcion, respuesta.Datos.descripcion);
      }
    } catch { /* no bloquear */ }
  }

  private async cachearDescripcionDepartamento(idDepartamento: number): Promise<void> {
    try {
      const respuesta = await this.usuariosService.obtenerDepartamentoPorId(idDepartamento);
      if (respuesta.Exito && respuesta.Datos) {
        await this.estadoService.guardar(ClavesEstado.departamentoDescripcion, respuesta.Datos.descripcion);
      }
    } catch { /* no bloquear */ }
  }

  private async cargarMenus(idRol: number): Promise<void> {
    try {
      const respuesta = await this.parametrosService.obtenerMenusPorPerfil(idRol);
      if (respuesta.Exito && respuesta.Datos) {
        this.menusService.establecer(respuesta.Datos);
      }
    } catch {
      // Si falla, el menú queda vacío pero no bloquea el login
    }
  }
}
