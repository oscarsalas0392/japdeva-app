import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { EstadoVacioComponent } from '../../components/estado-vacio/estado-vacio.component';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [PaginaComponent, SeccionHeaderComponent, EstadoVacioComponent],
})
export class InicioPage implements OnInit {
  private readonly estadoService = inject(EstadoAppService);
  private readonly router = inject(Router);

  readonly saludo = signal('');

  irANuevoReclamo(): void {
    this.router.navigate(['/nuevo-reclamo']);
  }

  async ngOnInit(): Promise<void> {
    const usuario = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (usuario) {
      this.saludo.set(`Hola, ${usuario.nombre}`);
    }
  }
}
