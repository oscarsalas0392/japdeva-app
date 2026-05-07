import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MascaraCorreoPipe } from '../../core/pipes/mascara-correo.pipe';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, cardOutline, createOutline, callOutline, calendarOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { FilaComponent } from '../../components/fila/fila.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { GeneralesService } from '../../core/services/generales.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonIcon, TranslateModule, MascaraCorreoPipe, PaginaComponent, TarjetaComponent, FilaComponent, GrupoCampoComponent],
})
export class PerfilPage {
  private readonly estadoService = inject(EstadoAppService);
  private readonly router        = inject(Router);
  readonly generales             = inject(GeneralesService);

  readonly usuario = signal<AutenticarUsuarioRespuestaModel | null>(null);
  readonly iniciales = signal('');

  constructor() {
    addIcons({ personOutline, mailOutline, cardOutline, createOutline, callOutline, calendarOutline });
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
    if (u) {
      this.usuario.set(u);
      this.iniciales.set(`${u.nombre?.[0] ?? ''}${u.apellidos?.[0] ?? ''}`.toUpperCase());
    }
  }
}
