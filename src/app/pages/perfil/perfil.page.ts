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
    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (!u) return;

    this.usuario.set(u);
    this.iniciales.set(`${u.nombre?.[0] ?? ''}${u.apellidos?.[0] ?? ''}`.toUpperCase());

    const idRol = await this.estadoService.obtener<number>(ClavesEstado.idRol);
    const interno = ROLES_INTERNOS.includes(idRol ?? 0);
    this.esInterno.set(interno);

    if (interno) {
      await Promise.all([
        this.cargarRol(idRol!),
        this.cargarDepartamento(u.id),
      ]);
    }
  }

  private async cargarRol(idRol: number): Promise<void> {
    const r = await this.usuariosService.obtenerRolPorId(idRol);
    if (r.Exito && r.Datos) this.descRol.set(r.Datos.descripcion);
  }

  private async cargarDepartamento(idUsuario: number): Promise<void> {
    const depResp = await this.usuariosService.obtenerDepartamentoPorUsuario(idUsuario);
    if (depResp.Exito && depResp.Datos) {
      const detalle = await this.usuariosService.obtenerDepartamentoPorId(depResp.Datos.idDepartamento);
      if (detalle.Exito && detalle.Datos) this.descDepto.set(detalle.Datos.descripcion);
    }
  }
}
