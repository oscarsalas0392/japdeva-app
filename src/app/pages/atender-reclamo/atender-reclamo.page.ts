import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { CampoSelectComponent } from '../../components/campo-select/campo-select.component';
import { CampoTextareaComponent } from '../../components/campo-textarea/campo-textarea.component';
import { AdjuntarArchivoComponent } from '../../components/adjuntar-archivo/adjuntar-archivo.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { DetalleReclamoService } from '../../core/services/detalle-reclamo.service';
import { SesionService } from '../../core/services/sesion.service';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { ArchivoSolicitudModel } from '../../core/models/reclamos/documento.model';
import { EstadoDetalleReclamoRespuestaModel } from '../../core/models/reclamos/estado-detalle.model';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

@Component({
  selector: 'app-atender-reclamo',
  templateUrl: './atender-reclamo.page.html',
  styleUrls: ['./atender-reclamo.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PaginaComponent,
    CampoFormularioComponent,
    CampoSelectComponent,
    CampoTextareaComponent,
    AdjuntarArchivoComponent,
    BotonCargandoComponent,
    GrupoCampoComponent,
  ],
})
export class AtenderReclamoPage implements OnInit {
  private readonly detalleService = inject(DetalleReclamoService);
  private readonly sesionService  = inject(SesionService);
  private readonly popup          = inject(PopupAvisoService);
  private readonly translate      = inject(TranslateService);
  private readonly fb             = inject(FormBuilder);
  private readonly destroyRef     = inject(DestroyRef);
  private readonly cdr            = inject(ChangeDetectorRef);

  readonly cargando          = signal(true);
  readonly guardando         = signal(false);
  readonly paginaLista       = signal(false);
  readonly reclamo           = signal<ReclamoRespuestaModel | null>(null);
  readonly estados           = signal<OpcionSelectModel[]>([]);
  readonly nivelesOrden      = signal<OpcionSelectModel[]>([]);
  readonly continuaProceso   = signal(false);
  readonly finalizaProceso   = signal(false);
  readonly devolucionProceso = signal(false);

  enviado = false;
  archivo: ArchivoSolicitudModel | null = null;

  private idDetalleReclamo  = 0;
  private idNivelProceso    = 0;
  private idUsuarioInterno  = 0;
  private estadosCompletos: EstadoDetalleReclamoRespuestaModel[] = [];
  private nivelesCompletos: any[] = [];

  readonly form = this.fb.group({
    idEstado:             [<number | null>null, [Validators.required]],
    idNivelSiguiente:     [<number | null>null],
    descripcion:          ['', [Validators.required]],
    descripcionResolucion:[''],
  });

  async ngOnInit(): Promise<void> {
    const nav = history.state;
    if (nav?.reclamo) this.reclamo.set(nav.reclamo);

    this.idUsuarioInterno = await this.sesionService.obtenerIdUsuario();

    try {
      if (this.reclamo()) {
        await this.cargarDetalle();
        await Promise.all([
          this.cargarEstados().catch(e => console.error('cargarEstados:', e)),
          this.cargarNiveles().catch(e => console.error('cargarNiveles:', e)),
        ]);
        this.suscribirEstado();
      }
    } finally {
      this.cargando.set(false);
    }
  }

  ionViewDidEnter(): void {
    this.paginaLista.set(true);
    this.cdr.markForCheck();
  }

  ionViewWillLeave(): void {
    this.paginaLista.set(false);
    this.form.reset();
    this.enviado = false;
    this.archivo = null;
  }

  private suscribirEstado(): void {
    this.form.get('idEstado')!.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(id => {
      const estadoSeleccionado = this.estadosCompletos.find(estado => estado.idEstadoDetalleReclamo === id);
      this.continuaProceso.set(estadoSeleccionado?.continuaProceso ?? false);
      this.finalizaProceso.set(estadoSeleccionado?.finalizarProceso ?? false);
      this.devolucionProceso.set(estadoSeleccionado?.devolucionProceso ?? false);
      this.form.patchValue({ idNivelSiguiente: null });
      this.filtrarNiveles(estadoSeleccionado?.devolucionProceso ?? false);
    });
  }

  private async cargarDetalle(): Promise<void> {
    const reclamoActual = this.reclamo()!;
    const detalleRespuesta = await this.detalleService.obtenerPorDepartamentoYEstado(
      reclamoActual.idDepartamentoActual,
      reclamoActual.idEstadoDetalleReclamo,
      reclamoActual.id,
    );
    if (detalleRespuesta.Exito && detalleRespuesta.Datos) {
      this.idDetalleReclamo = detalleRespuesta.Datos.id;
      this.idNivelProceso   = detalleRespuesta.Datos.idNivelProceso;
    }
  }

  private async cargarEstados(): Promise<void> {
    const estadosRespuesta = await this.detalleService.obtenerEstados(this.idNivelProceso);
    const lista = estadosRespuesta.Exito ? (estadosRespuesta.Datos?.lista ?? (Array.isArray(estadosRespuesta.Datos) ? estadosRespuesta.Datos : [])) : [];
    this.estadosCompletos = lista as EstadoDetalleReclamoRespuestaModel[];
    this.estados.set(this.estadosCompletos.map(e => ({
      valor:    e.idEstadoDetalleReclamo,
      etiqueta: e.descripcionEstadoDetalleReclamo,
    })));
  }

  private async cargarNiveles(): Promise<void> {
    const nivelesRespuesta = await this.detalleService.obtenerOrdenesNivel(this.idNivelProceso);
    const lista = nivelesRespuesta.Exito ? (nivelesRespuesta.Datos?.lista ?? (Array.isArray(nivelesRespuesta.Datos) ? nivelesRespuesta.Datos : [])) : [];
    this.nivelesCompletos = lista as any[];
  }

  private filtrarNiveles(devolucion: boolean): void {
    const opciones = this.nivelesCompletos
      .filter((n: any) => {
        const esDevolucion = n.devolucionNivel ?? n.DevolucionNivel ?? false;
        return devolucion ? esDevolucion : !esDevolucion;
      })
      .map((n: any) => ({
        valor:    n.idNivelInferior        ?? n.IdNivelInferior,
        etiqueta: n.descripcionDepartamento ?? n.DescripcionDepartamento,
      }));
    this.nivelesOrden.set(opciones);
    if (opciones.length === 1) {
      this.form.patchValue({ idNivelSiguiente: opciones[0].valor });
    }
  }

  async guardar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid || !this.idDetalleReclamo) return;

    this.guardando.set(true);
    const { idEstado, idNivelSiguiente, descripcion, descripcionResolucion } = this.form.getRawValue();

    const editarRespuesta = await this.detalleService.editar({
      IdDetalleReclamo:        this.idDetalleReclamo,
      IdEstadoDetalleReclamo:  idEstado!,
      IdNivelSiguienteProceso: idNivelSiguiente ?? undefined,
      IdUsuarioInterno:        this.idUsuarioInterno,
      Descripcion:             descripcion!,
      DescripcionResolucion:   descripcionResolucion!,
    });

    if (editarRespuesta.Manejado) {
      this.guardando.set(false);
      return;
    }
    if (!editarRespuesta.Exito) {
      this.guardando.set(false);
      this.popup.mostrar({ tipo: 'error', titulo: this.translate.instant('errores.titulo'), mensaje: editarRespuesta.Mensaje });
      return;
    }

    if (this.archivo) {
      await this.detalleService.agregarDocumento({
        IdDetalleReclamo: this.idDetalleReclamo,
        ListaDocumentos:  [this.archivo],
      });
    }

    this.guardando.set(false);
    this.popup.mostrar({ tipo: 'exito', titulo: this.translate.instant('exito.titulo'), mensaje: this.translate.instant('atenderReclamo.exito') });
    this.form.reset();
    this.archivo = null;
    this.enviado = false;
  }
}
