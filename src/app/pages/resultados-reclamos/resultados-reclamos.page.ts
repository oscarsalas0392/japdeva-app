import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { ListaReclamosComponent } from '../../components/lista-reclamos/lista-reclamos.component';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';

@Component({
  selector: 'app-resultados-reclamos',
  templateUrl: './resultados-reclamos.page.html',
  styleUrls: ['./resultados-reclamos.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, PaginaComponent, ListaReclamosComponent],
})
export class ResultadosReclamosPage implements OnInit {
  private readonly estadoService = inject(EstadoAppService);
  private readonly router        = inject(Router);
  private readonly cdr           = inject(ChangeDetectorRef);

  readonly paginaLista = signal(false);
  readonly reclamos    = signal<ReclamoRespuestaModel[]>([]);

  readonly opcionesReclamo: OpcionAccionModel[] = [
    { id: 'ver', etiqueta: 'inicio.acciones.ver' },
  ];

  ngOnInit(): void {
    const nav = history.state;
    if (!nav?.reclamos) {
      this.router.navigate(['/buscar-reclamos-fecha-estado'], { replaceUrl: true });
      return;
    }
    this.reclamos.set(nav.reclamos);
  }

  ionViewDidEnter(): void {
    this.paginaLista.set(true);
    this.cdr.markForCheck();
  }

  ionViewWillLeave(): void {
    this.paginaLista.set(false);
    this.cdr.markForCheck();
  }

  async manejarAccion(accionId: string, reclamo: ReclamoRespuestaModel): Promise<void> {
    if (accionId === 'ver') {
      await this.estadoService.guardar(ClavesEstado.departamentoReclamo, reclamo.descripcionDepartamento);
      this.router.navigate(['/informacion-reclamo', reclamo.id], { state: { reclamo } });
    }
  }
}
