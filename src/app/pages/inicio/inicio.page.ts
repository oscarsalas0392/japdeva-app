import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonSpinner } from '@ionic/angular/standalone';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { EstadoVacioComponent } from '../../components/estado-vacio/estado-vacio.component';
import { ItemReclamoComponent } from '../../components/item-reclamo/item-reclamo.component';
import { ItemSeleccionableComponent } from '../../components/item-seleccionable/item-seleccionable.component';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { ReclamoService } from '../../core/services/reclamo.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    IonSpinner,
    PaginaComponent,
    SeccionHeaderComponent,
    EstadoVacioComponent,
    ItemReclamoComponent,
    ItemSeleccionableComponent,
  ],
})
export class InicioPage implements OnInit {
  private readonly estadoService  = inject(EstadoAppService);
  private readonly reclamoService = inject(ReclamoService);
  private readonly router         = inject(Router);

  readonly saludo   = signal('');
  readonly reclamos = signal<ReclamoRespuestaModel[]>([]);
  readonly cargando = signal(true);

  private usuarioId = 0;

  readonly opcionesReclamo: OpcionAccionModel[] = [
    { id: 'ver',   etiqueta: 'inicio.acciones.ver' },
    { id: 'nuevo', etiqueta: 'inicio.acciones.nuevo', icono: 'add-circle-outline' },
  ];

  async ngOnInit(): Promise<void> {
    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (u) {
      this.usuarioId = u.id;
      this.saludo.set(`Hola, ${u.nombre}`);
    }
    await this.cargarReclamos();
  }

  // Se ejecuta cada vez que el usuario regresa a esta pantalla
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
