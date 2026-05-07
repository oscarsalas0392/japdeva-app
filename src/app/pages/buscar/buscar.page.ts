import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { ChipsFiltroComponent } from '../../components/chips-filtro/chips-filtro.component';
import { ListaReclamosComponent } from '../../components/lista-reclamos/lista-reclamos.component';
import { ReclamoService } from '../../core/services/reclamo.service';
import { EstadoAppService } from '../../core/state/app.service';
import { GeneralesService } from '../../core/services/generales.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { EstadoReclamoEnum } from '../../core/models/reclamos/estado-reclamo.enum';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';
import { ChipFiltro } from '../../components/chips-filtro/chips-filtro.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
  standalone: true,
  imports: [TranslateModule, PaginaComponent, ChipsFiltroComponent, ListaReclamosComponent],
})
export class BuscarPage implements OnInit {
  private readonly reclamoService = inject(ReclamoService);
  private readonly estadoService  = inject(EstadoAppService);
  private readonly router         = inject(Router);
  readonly generales              = inject(GeneralesService);

  private readonly todosReclamos = signal<ReclamoRespuestaModel[]>([]);
  readonly cargando     = signal(true);
  readonly termino      = signal('');
  readonly estadoActivo = signal(0);

  readonly filtros: ChipFiltro[] = [
    { id: 0,                           etiqueta: 'Todos'      },
    { id: EstadoReclamoEnum.Pendiente,  etiqueta: 'Pendiente'  },
    { id: EstadoReclamoEnum.EnProceso,  etiqueta: 'En proceso' },
    { id: EstadoReclamoEnum.Completado, etiqueta: 'Completado' },
    { id: EstadoReclamoEnum.Rechazado,  etiqueta: 'Rechazado'  },
  ];

  readonly opcionesReclamo: OpcionAccionModel[] = [
    { id: 'ver', etiqueta: 'inicio.acciones.ver' },
  ];

  readonly reclamosFiltrados = computed(() => {
    const termino = this.termino().toLowerCase().trim();
    const estado  = this.estadoActivo();
    return this.todosReclamos().filter(r => {
      const coincideEstado = estado === 0 || r.idEstadoReclamo === estado;
      if (!coincideEstado) return false;
      if (!termino) return true;
      const codigo = this.generales.codigoReclamo(r.id, r.fechaRegistro).toLowerCase();
      return codigo.includes(termino)
        || r.titulo.toLowerCase().includes(termino)
        || r.descripcion.toLowerCase().includes(termino);
    });
  });

  private usuarioId = 0;

  async ngOnInit(): Promise<void> {
    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (u) this.usuarioId = u.id;
    const r = await this.reclamoService.obtenerPorUsuarioOrdenado(this.usuarioId);
    if (r.Exito && r.Datos?.lista) this.todosReclamos.set(r.Datos.lista);
    this.cargando.set(false);
  }

  seleccionarFiltro(id: number): void {
    this.estadoActivo.set(id);
  }

  onBusqueda(termino: string): void {
    this.termino.set(termino);
  }

  manejarAccion(accionId: string, reclamo: ReclamoRespuestaModel): void {
    if (accionId === 'ver') {
      this.router.navigate(['/detalle-reclamo', reclamo.id], { state: { reclamo } });
    }
  }
}
