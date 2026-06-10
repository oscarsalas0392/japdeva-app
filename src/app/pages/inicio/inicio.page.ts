import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { ListaReclamosComponent } from '../../components/lista-reclamos/lista-reclamos.component';
import { BotonNuevoReclamoComponent } from '../../components/boton-nuevo-reclamo/boton-nuevo-reclamo.component';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';
import { SesionService } from '../../core/services/sesion.service';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { ReclamoService } from '../../core/services/reclamo.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    PaginaComponent,
    SeccionHeaderComponent,
    ListaReclamosComponent,
    BotonNuevoReclamoComponent,
  ],
})
export class InicioPage implements OnInit {
  private readonly sesionService  = inject(SesionService);
  private readonly reclamoService = inject(ReclamoService);
  private readonly router         = inject(Router);

  readonly saludo   = signal('');
  readonly reclamos = signal<ReclamoRespuestaModel[]>([]);
  readonly cargando = signal(true);

  private usuarioId = 0;

  readonly opcionesReclamo: OpcionAccionModel[] = [
    { id: 'ver', etiqueta: 'inicio.acciones.ver' }
  ];

  async ngOnInit(): Promise<void> {
    const usuarioSesion = await this.sesionService.obtenerUsuario();
    if (usuarioSesion) {
      this.usuarioId = usuarioSesion.id;
      this.saludo.set(`Hola, ${usuarioSesion.nombre}`);
    }
    await this.cargarReclamos();
  }

  async ionViewWillEnter(): Promise<void> {
    if (this.usuarioId) {
      await this.cargarReclamos();
    }
  }

  async cargarReclamos(): Promise<void> {
    this.cargando.set(true);
    const respuesta = await this.reclamoService.obtenerPorUsuarioOrdenado(this.usuarioId);
    if (respuesta.Exito && respuesta.Datos?.lista) {
      this.reclamos.set(respuesta.Datos.lista);
    }
    this.cargando.set(false);
  }

  irANuevoReclamo(): void {
    this.router.navigate(['/nuevo-reclamo']);
  }

  manejarAccion(accionId: string, reclamo: ReclamoRespuestaModel): void {
    switch (accionId) {
      case 'ver':
        this.router.navigate(['/detalle-reclamo', reclamo.id], { state: { reclamo } });
        break;
      case 'nuevo':
        this.router.navigate(['/nuevo-reclamo']);
        break;
    }
  }
}
