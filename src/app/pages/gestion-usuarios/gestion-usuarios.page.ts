import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, cardOutline, mailOutline, shieldOutline, briefcaseOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { FilaComponent } from '../../components/fila/fila.component';
import { CampoSelectComponent } from '../../components/campo-select/campo-select.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { SesionService } from '../../core/services/sesion.service';
import { UsuarioRespuestaModel } from '../../core/models/usuarios/usuario.model';
import { UsuarioRolRespuestaModel } from '../../core/models/usuarios/usuario-rol.model';
import { DepartamentoUsuarioRespuestaModel } from '../../core/models/usuarios/departamento-usuario.model';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IonIcon,
    PaginaComponent,
    TarjetaComponent,
    FilaComponent,
    CampoSelectComponent,
    BotonCargandoComponent,
    GrupoCampoComponent,
  ],
})
export class GestionUsuariosPage implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly sesionService   = inject(SesionService);
  private readonly popup           = inject(PopupAvisoService);
  private readonly translate       = inject(TranslateService);
  private readonly router          = inject(Router);
  private readonly fb              = inject(FormBuilder);

  readonly guardando     = signal(false);
  readonly usuario       = signal<UsuarioRespuestaModel | null>(null);
  readonly roles         = signal<OpcionSelectModel[]>([]);
  readonly departamentos = signal<OpcionSelectModel[]>([]);

  enviado = false;

  constructor() {
    addIcons({ personOutline, cardOutline, mailOutline, shieldOutline, briefcaseOutline });
  }

  private usuarioRol:    UsuarioRolRespuestaModel | null = null;
  private deptoAsignado: DepartamentoUsuarioRespuestaModel | null = null;
  private adminId = 0;

  get rolActual(): string {
    if (!this.usuarioRol) return 'Sin rol asignado';
    return this.roles().find(r => r.valor === this.usuarioRol!.idRol)?.etiqueta ?? 'Sin rol asignado';
  }

  get deptoActual(): string {
    if (!this.deptoAsignado) return 'Sin departamento';
    return this.departamentos().find(d => d.valor === this.deptoAsignado!.idDepartamento)?.etiqueta ?? 'Sin departamento';
  }

  readonly formAsignacion = this.fb.group({
    idRol:          [<number | null>null, [Validators.required]],
    idDepartamento: [<number | null>null, [Validators.required]],
  });

  async ngOnInit(): Promise<void> {
    const nav = history.state;
    if (nav?.usuario) {
      await this.cargarDatosUsuario(nav.usuario);
    } else {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: this.translate.instant('errores.sinUsuarioSeleccionado'),
      });
      await this.router.navigate(['/inicio-usuario-interno'], { replaceUrl: true });
    }
  }

  async cargarDatosUsuario(encontrado: UsuarioRespuestaModel): Promise<void> {
    this.usuario.set(null);
    this.usuarioRol    = null;
    this.deptoAsignado = null;

    this.adminId = await this.sesionService.obtenerIdUsuario();

    const [rolesOpciones, departamentosOpciones, usuarioRolRespuesta, departamentoRespuesta] = await Promise.all([
      this.usuariosService.obtenerRolesActivosComoOpciones(),
      this.usuariosService.obtenerDepartamentosActivosComoOpciones(),
      this.usuariosService.obtenerRolPorUsuario(encontrado.id),
      this.usuariosService.obtenerDepartamentoPorUsuario(encontrado.id),
    ]);

    this.roles.set(rolesOpciones);
    this.departamentos.set(departamentosOpciones);

    if (usuarioRolRespuesta.Exito && usuarioRolRespuesta.Datos) {
      this.usuarioRol = usuarioRolRespuesta.Datos;
      this.formAsignacion.patchValue({ idRol: usuarioRolRespuesta.Datos.idRol });
    }

    if (departamentoRespuesta.Exito && departamentoRespuesta.Datos) {
      this.deptoAsignado = departamentoRespuesta.Datos;
      this.formAsignacion.patchValue({ idDepartamento: departamentoRespuesta.Datos.idDepartamento });
    }

    this.usuario.set(encontrado);
  }

  async guardar(): Promise<void> {
    this.enviado = true;
    if (this.formAsignacion.invalid || !this.usuario() || !this.usuarioRol) return;

    this.guardando.set(true);
    const { idRol, idDepartamento } = this.formAsignacion.getRawValue();

    const [rolRespuesta, departamentoActualizado] = await Promise.all([
      this.usuariosService.actualizarRolUsuario({
        Id:        this.usuarioRol.id,
        IdRol:     idRol!,
        IdUsuario: this.usuario()!.id,
      }),
      this.usuariosService.reemplazarDepartamentoUsuario(
        this.usuario()!.id,
        idDepartamento!,
        this.adminId,
        this.deptoAsignado?.id,
      ),
    ]);

    this.guardando.set(false);

    if (rolRespuesta.Manejado) return;
    if (!rolRespuesta.Exito || !departamentoActualizado) {
      this.popup.mostrar({ tipo: 'error', titulo: this.translate.instant('errores.titulo'), mensaje: rolRespuesta.Mensaje });
      return;
    }

    this.popup.mostrar({ tipo: 'exito', titulo: this.translate.instant('exito.titulo'), mensaje: this.translate.instant('gestionUsuarios.exito') });
  }
}
