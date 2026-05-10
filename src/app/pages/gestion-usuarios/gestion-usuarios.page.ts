import { Component, inject, OnInit, signal } from '@angular/core';
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
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { UsuarioRespuestaModel } from '../../core/models/usuarios/usuario.model';
import { UsuarioRolRespuestaModel } from '../../core/models/usuarios/usuario-rol.model';
import { DepartamentoUsuarioRespuestaModel } from '../../core/models/usuarios/departamento-usuario.model';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IonIcon,
    PaginaComponent,
    TarjetaComponent,
    FilaComponent,
    CampoSelectComponent,
    BotonCargandoComponent,
  ],
})
export class GestionUsuariosPage implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly estadoService   = inject(EstadoAppService);
  private readonly popup           = inject(PopupAvisoService);
  private readonly translate       = inject(TranslateService);
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
    }
  }

  async cargarDatosUsuario(encontrado: UsuarioRespuestaModel): Promise<void> {
    this.usuario.set(null);
    this.usuarioRol    = null;
    this.deptoAsignado = null;

    const adminResp = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    this.adminId    = adminResp?.id ?? 0;

    const [rolesResp, deptosResp, usuarioRolResp, deptoResp] = await Promise.all([
      this.usuariosService.obtenerRoles(),
      this.usuariosService.obtenerDepartamentos(),
      this.usuariosService.obtenerRolPorUsuario(encontrado.id),
      this.usuariosService.obtenerDepartamentoPorUsuario(encontrado.id),
    ]);

    if (rolesResp.Exito && Array.isArray(rolesResp.Datos)) {
      this.roles.set(rolesResp.Datos
        .filter(r => r.activo)
        .map(r => ({ valor: r.id, etiqueta: r.descripcion }))
      );
    }

    if (deptosResp.Exito && Array.isArray(deptosResp.Datos)) {
      this.departamentos.set(deptosResp.Datos
        .filter(d => d.activo)
        .map(d => ({ valor: d.id, etiqueta: d.descripcion }))
      );
    }

    if (usuarioRolResp.Exito && usuarioRolResp.Datos) {
      this.usuarioRol = usuarioRolResp.Datos;
      this.formAsignacion.patchValue({ idRol: this.usuarioRol.idRol });
    }

    if (deptoResp.Exito && deptoResp.Datos) {
      this.deptoAsignado = deptoResp.Datos;
      this.formAsignacion.patchValue({ idDepartamento: this.deptoAsignado.idDepartamento });
    }

    this.usuario.set(encontrado);
  }

  async guardar(): Promise<void> {
    this.enviado = true;
    if (this.formAsignacion.invalid || !this.usuario() || !this.usuarioRol) return;

    this.guardando.set(true);
    const { idRol, idDepartamento } = this.formAsignacion.getRawValue();

    const [rolResp, deptoOk] = await Promise.all([
      this.usuariosService.actualizarRolUsuario({
        Id:        this.usuarioRol.id,
        IdRol:     idRol!,
        IdUsuario: this.usuario()!.id,
      }),
      this.actualizarDepartamento(idDepartamento!),
    ]);

    this.guardando.set(false);

    if (!rolResp.Exito || !deptoOk) {
      this.popup.mostrar({ tipo: 'error', titulo: this.translate.instant('errores.titulo'), mensaje: rolResp.Mensaje });
      return;
    }

    this.popup.mostrar({ tipo: 'exito', titulo: this.translate.instant('exito.titulo'), mensaje: this.translate.instant('gestionUsuarios.exito') });
  }

  private async actualizarDepartamento(idDepartamento: number): Promise<boolean> {
    try {
      if (this.deptoAsignado) {
        await this.usuariosService.eliminarDepartamentoUsuario(this.deptoAsignado.id);
      }
      const r = await this.usuariosService.agregarDepartamentoUsuario({
        IdUsuario:              this.usuario()!.id,
        IdDepartamento:         idDepartamento,
        IdUsuarioAdministrador: this.adminId,
      });
      return r.Exito;
    } catch {
      return false;
    }
  }
}
