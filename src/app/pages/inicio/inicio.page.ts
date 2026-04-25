import { Component, inject, OnInit, signal } from '@angular/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [PaginaComponent],
})
export class InicioPage implements OnInit {
  private readonly estadoService = inject(EstadoAppService);

  readonly saludo = signal('');

  async ngOnInit(): Promise<void> {
    const usuario = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (usuario) {
      this.saludo.set(`Hola, ${usuario.nombre}`);
    }
  }
}
