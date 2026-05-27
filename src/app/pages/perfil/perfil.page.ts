import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MascaraCorreoPipe } from '../../core/pipes/mascara-correo.pipe';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, cardOutline, createOutline,
  callOutline, calendarOutline, briefcaseOutline, shieldOutline,
} from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { FilaComponent } from '../../components/fila/fila.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { EstadoAppService } from '../../core/state/app.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { GeneralesService } from '../../core/services/generales.service';

const ROLES_INTERNOS = [1, 2, 3];

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, TranslateModule, MascaraCorreoPipe, PaginaComponent, TarjetaComponent, FilaComponent, GrupoCampoComponent],
})
export class PerfilPage {
  private readonly estadoService   = inject(EstadoAppService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly router          = inject(Router);
  readonly generales               = inject(GeneralesService);

  readonly usuario     = signal<AutenticarUsuarioRespuestaModel | null>(null);
  readonly iniciales   = signal('');
  readonly esInterno   = signal(false);
  readonly descRol     = signal('');
  readonly descDepto   = signal('');

  constructor() {
    addIcons({ personOutline, mailOutline, cardOutline, createOutline, callOutline, calendarOutline, briefcaseOutline, shieldOutline });
  }

  irACambiarContrasena(): void {
    this.router.navigate(['/cambiar-contrasena']);
  }

  irAEditarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
  }

  irATerminos(): void {
    this.router.navigate(['/terminos-condiciones']);
  }

  async ionViewWillEnter(): Promise<void> {
    const usuarioSesion = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (!usuarioSesion) return;

    this.usuario.set(usuarioSesion);
    this.iniciales.set(`${usuarioSesion.nombre?.[0] ?? ''}${usuarioSesion.apellidos?.[0] ?? ''}`.toUpperCase());

    const idRol = await this.estadoService.obtener<number>(ClavesEstado.idRol);
    const interno = ROLES_INTERNOS.includes(idRol ?? 0);
    this.esInterno.set(interno);

    if (interno) {
      await Promise.all([
        this.cargarRol(idRol!),
        this.cargarDepartamento(usuarioSesion.id),
      ]);
    }
  }

  private async cargarRol(idRol: number): Promise<void> {
    const descCache = await this.estadoService.obtener<string>(ClavesEstado.rolDescripcion);
    if (descCache) { this.descRol.set(descCache); return; }
    const rolRespuesta = await this.usuariosService.obtenerRolPorId(idRol);
    if (rolRespuesta.Exito && rolRespuesta.Datos) this.descRol.set(rolRespuesta.Datos.descripcion);
  }

  private async cargarDepartamento(idUsuario: number): Promise<void> {
    const descCache = await this.estadoService.obtener<string>(ClavesEstado.departamentoDescripcion);
    if (descCache) { this.descDepto.set(descCache); return; }
    const departamentoRespuesta = await this.usuariosService.obtenerDepartamentoPorUsuario(idUsuario);
    if (departamentoRespuesta.Exito && departamentoRespuesta.Datos) {
      const detalleRespuesta = await this.usuariosService.obtenerDepartamentoPorId(departamentoRespuesta.Datos.idDepartamento);
      if (detalleRespuesta.Exito && detalleRespuesta.Datos) this.descDepto.set(detalleRespuesta.Datos.descripcion);
    }
  }
}
