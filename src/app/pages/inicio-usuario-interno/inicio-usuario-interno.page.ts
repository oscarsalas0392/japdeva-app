import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { ListaReclamosComponent } from '../../components/lista-reclamos/lista-reclamos.component';
import { ReclamoService } from '../../core/services/reclamo.service';
import { DetalleReclamoService } from '../../core/services/detalle-reclamo.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { ReclamoAccionesService } from '../../core/services/reclamo-acciones.service';
import { SesionService } from '../../core/services/sesion.service';
import { EstadoAppService } from '../../core/state/app.service';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { DepartamentoUsuarioRespuestaModel } from '../../core/models/usuarios/departamento-usuario.model';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';

@Component({
  selector: 'app-inicio-usuario-interno',
  templateUrl: './inicio-usuario-interno.page.html',
  styleUrls: ['./inicio-usuario-interno.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, PaginaComponent, SeccionHeaderComponent, ListaReclamosComponent],
})
export class InicioUsuarioInternoPage implements OnInit {
  private readonly reclamoService        = inject(ReclamoService);
  private readonly detalleReclamoService = inject(DetalleReclamoService);
  private readonly usuariosService       = inject(UsuariosService);
  private readonly accionesService       = inject(ReclamoAccionesService);
  private readonly sesionService         = inject(SesionService);
  private readonly estadoService         = inject(EstadoAppService);
  private readonly router                = inject(Router);
  private readonly popup                 = inject(PopupAvisoService);
  private readonly translate             = inject(TranslateService);
  private readonly cdr                   = inject(ChangeDetectorRef);

  readonly cargando = signal(true);
  readonly saludo   = signal('');
  readonly reclamos = signal<ReclamoRespuestaModel[]>([]);

  private idDepartamento = 0;
  private idUsuarioActual = 0;

  readonly opcionesReclamo = (reclamo: ReclamoRespuestaModel): OpcionAccionModel[] =>
    this.accionesService.opcionesUsuarioInterno(reclamo, this.idUsuarioActual);

  async ngOnInit(): Promise<void> {
    const usuarioSesion = await this.sesionService.obtenerUsuario();
    if (usuarioSesion) {
      this.saludo.set(`Hola, ${usuarioSesion.nombre}`);
      this.idUsuarioActual = usuarioSesion.id;
    }
    await this.cargarDatos(usuarioSesion?.id ?? 0);
  }

  async ionViewWillEnter(): Promise<void> {
    if (this.idDepartamento) await this.cargarReclamos();
  }

  private async cargarDatos(idUsuario: number): Promise<void> {
    // Primero intentamos leer del cache (guardado al hacer login).
    const cacheado = await this.estadoService.obtener<DepartamentoUsuarioRespuestaModel>(ClavesEstado.departamentoUsuario);
    if (cacheado?.idDepartamento) {
      this.idDepartamento = cacheado.idDepartamento;
    } else {
      const departamentoRespuesta = await this.usuariosService.obtenerDepartamentoPorUsuario(idUsuario);
      if (departamentoRespuesta.Exito && departamentoRespuesta.Datos) {
        this.idDepartamento = departamentoRespuesta.Datos.idDepartamento;
        await this.estadoService.guardar(ClavesEstado.departamentoUsuario, departamentoRespuesta.Datos);
      }
    }
    await this.cargarReclamos();
  }

  private async cargarReclamos(): Promise<void> {
    this.cargando.set(true);
    if (this.idDepartamento) {
      const reclamosRespuesta = await this.reclamoService.obtenerPorDepartamento(this.idDepartamento);
      if (reclamosRespuesta.Exito && reclamosRespuesta.Datos?.lista) this.reclamos.set(reclamosRespuesta.Datos.lista);
    }
    this.cargando.set(false);
  }

  async manejarAccion(accionId: string, reclamo: ReclamoRespuestaModel): Promise<void> {
    if (accionId === 'asignar') {
      await this.asignarReclamo(reclamo);
    } else if (accionId === 'atender') {
      this.router.navigate(['/atender-reclamo', reclamo.id], { state: { reclamo } });
    } else if (accionId === 'ver') {
      await this.estadoService.guardar(ClavesEstado.departamentoReclamo, reclamo.descripcionDepartamento);
      this.router.navigate(['/informacion-reclamo', reclamo.id], { state: { reclamo } });
    }
  }

  private async asignarReclamo(reclamo: ReclamoRespuestaModel): Promise<void> {
    const respuesta = await this.detalleReclamoService.asignarPorReclamo(
      reclamo.id,
      reclamo.idDepartamentoActual,
      this.idUsuarioActual,
    );

    if (respuesta.Manejado) return;
    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje || this.translate.instant('inicioUsuarioInterno.acciones.errorAsignar'),
      });
      return;
    }

    await this.cargarReclamos();
    this.cdr.markForCheck();

    this.router.navigate(['/atender-reclamo', reclamo.id], { state: { reclamo } });
  }
}
