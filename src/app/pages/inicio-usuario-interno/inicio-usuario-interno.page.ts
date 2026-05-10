import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { ListaReclamosComponent } from '../../components/lista-reclamos/lista-reclamos.component';
import { ReclamoService } from '../../core/services/reclamo.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';

@Component({
  selector: 'app-inicio-usuario-interno',
  templateUrl: './inicio-usuario-interno.page.html',
  styleUrls: ['./inicio-usuario-interno.page.scss'],
  standalone: true,
  imports: [TranslateModule, PaginaComponent, SeccionHeaderComponent, ListaReclamosComponent],
})
export class InicioUsuarioInternoPage implements OnInit {
  private readonly reclamoService  = inject(ReclamoService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly estadoService   = inject(EstadoAppService);
  private readonly router          = inject(Router);

  readonly cargando = signal(true);
  readonly saludo   = signal('');
  readonly reclamos = signal<ReclamoRespuestaModel[]>([]);

  private idDepartamento = 0;

  readonly opcionesReclamo: OpcionAccionModel[] = [
    { id: 'ver', etiqueta: 'inicio.acciones.ver' },
  ];

  async ngOnInit(): Promise<void> {
    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (u) this.saludo.set(`Hola, ${u.nombre}`);
    await this.cargarDatos(u?.id ?? 0);
  }

  async ionViewWillEnter(): Promise<void> {
    if (this.idDepartamento) await this.cargarReclamos();
  }

  private async cargarDatos(idUsuario: number): Promise<void> {
    const depResp = await this.usuariosService.obtenerDepartamentoPorUsuario(idUsuario);
    if (depResp.Exito && depResp.Datos) {
      this.idDepartamento = depResp.Datos.idDepartamento;
    }
    await this.cargarReclamos();
  }

  private async cargarReclamos(): Promise<void> {
    this.cargando.set(true);
    if (this.idDepartamento) {
      const r = await this.reclamoService.obtenerPorDepartamento(this.idDepartamento);
      if (r.Exito && r.Datos?.lista) this.reclamos.set(r.Datos.lista);
    }
    this.cargando.set(false);
  }

  manejarAccion(accionId: string, reclamo: ReclamoRespuestaModel): void {
    if (accionId === 'ver') {
      this.router.navigate(['/detalle-reclamo', reclamo.id], { state: { reclamo } });
    }
  }
}
