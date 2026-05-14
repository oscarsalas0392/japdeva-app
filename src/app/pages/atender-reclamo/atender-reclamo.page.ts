import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, personOutline, attachOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { FilaComponent } from '../../components/fila/fila.component';
import { ListaDocumentosComponent } from '../../components/lista-documentos/lista-documentos.component';
import { ExpedienteDigitalComponent } from '../../components/expediente-digital/expediente-digital.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { CampoSelectComponent } from '../../components/campo-select/campo-select.component';
import { CampoTextareaComponent } from '../../components/campo-textarea/campo-textarea.component';
import { AdjuntarArchivoComponent } from '../../components/adjuntar-archivo/adjuntar-archivo.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { TabsComponent, TabItem } from '../../components/tabs/tabs.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { DetalleReclamoService } from '../../core/services/detalle-reclamo.service';
import { ReclamoService } from '../../core/services/reclamo.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { GeneralesService } from '../../core/services/generales.service';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { UsuarioRespuestaModel } from '../../core/models/usuarios/usuario.model';
import { ArchivoSolicitudModel } from '../../core/models/reclamos/documento.model';
import { DocumentoUsuarioRespuestaModel } from '../../core/models/reclamos/documento-usuario-respuesta.model';
import { DocumentoInternoRespuestaModel } from '../../core/models/reclamos/documento-interno.model';
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
    IonIcon,
    PaginaComponent,
    TarjetaComponent,
    FilaComponent,
    ListaDocumentosComponent,
    ExpedienteDigitalComponent,
    CampoFormularioComponent,
    CampoSelectComponent,
    CampoTextareaComponent,
    AdjuntarArchivoComponent,
    BotonCargandoComponent,
    TabsComponent,
    GrupoCampoComponent,
  ],
})
export class AtenderReclamoPage implements OnInit {
  private readonly detalleService  = inject(DetalleReclamoService);
  private readonly reclamoService  = inject(ReclamoService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly estadoService   = inject(EstadoAppService);
  private readonly popup           = inject(PopupAvisoService);
  private readonly translate       = inject(TranslateService);
  private readonly fb              = inject(FormBuilder);
  private readonly destroyRef      = inject(DestroyRef);
  readonly generales               = inject(GeneralesService);

  readonly cargando    = signal(true);
  readonly guardando   = signal(false);
  readonly reclamo     = signal<ReclamoRespuestaModel | null>(null);
  readonly cliente     = signal<UsuarioRespuestaModel | null>(null);
  readonly estados        = signal<OpcionSelectModel[]>([]);
  readonly nivelesOrden       = signal<OpcionSelectModel[]>([]);
  readonly documentosExternos = signal<DocumentoUsuarioRespuestaModel[]>([]);
  readonly documentosInternos = signal<DocumentoInternoRespuestaModel[]>([]);
  readonly tabActivo   = signal('informacion');

  readonly tabs: TabItem[] = [
    { id: 'informacion', etiqueta: 'Información' },
    { id: 'gestion',     etiqueta: 'Gestión'     },
  ];

  enviado = false;
  archivo: ArchivoSolicitudModel | null = null;

  private idDetalleReclamo  = 0;
  private idNivelProceso    = 0;
  private idUsuarioInterno  = 0;
  private estadosCompletos: EstadoDetalleReclamoRespuestaModel[] = [];
  private nivelesCompletos: any[] = [];

  readonly continuaProceso  = signal(false);
  readonly finalizaProceso  = signal(false);
  readonly devolucionProceso = signal(false);

  constructor() {
    addIcons({ documentTextOutline, personOutline, attachOutline });
  }

  private suscribirEstado(): void {
    this.form.get('idEstado')!.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(id => {
      const e = this.estadosCompletos.find(e => e.idEstadoDetalleReclamo === id);
      this.continuaProceso.set(e?.continuaProceso ?? false);
      this.finalizaProceso.set(e?.finalizarProceso ?? false);
      this.devolucionProceso.set(e?.devolucionProceso ?? false);
      this.form.patchValue({ idNivelSiguiente: null });
      this.filtrarNiveles(e?.devolucionProceso ?? false);
    });
  }

  readonly form = this.fb.group({
    idEstado:             [<number | null>null, [Validators.required]],
    idNivelSiguiente:     [<number | null>null],
    descripcion:          ['', [Validators.required]],
    descripcionResolucion:[''],
  });

  async ngOnInit(): Promise<void> {
    const nav = history.state;
    if (nav?.reclamo) this.reclamo.set(nav.reclamo);

    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    this.idUsuarioInterno = u?.id ?? 0;

    try {
      if (this.reclamo()) {
        await this.cargarDetalle();
        await Promise.all([
          this.cargarEstados().catch(e => console.error('cargarEstados:', e)),
          this.cargarNiveles().catch(e => console.error('cargarNiveles:', e)),
          this.cargarCliente().catch(e => console.error('cargarCliente:', e)),
          this.cargarDocumentos().catch(e => console.error('cargarDocumentos:', e)),
        ]);
        this.suscribirEstado();
      }
    } finally {
      this.cargando.set(false);
    }
  }

  private async cargarDetalle(): Promise<void> {
    const rec = this.reclamo()!;
    const r = await this.detalleService.obtenerPorDepartamentoYEstado(
      rec.idDepartamentoActual,
      rec.idEstadoDetalleReclamo,
      rec.id,
    );
    if (r.Exito && r.Datos) {
      this.idDetalleReclamo = r.Datos.id;
      this.idNivelProceso   = r.Datos.idNivelProceso;
    }
  }

  private async cargarEstados(): Promise<void> {
    const r = await this.detalleService.obtenerEstados(this.idNivelProceso);
    const lista = r.Exito ? (r.Datos?.lista ?? (Array.isArray(r.Datos) ? r.Datos : [])) : [];
    this.estadosCompletos = lista as EstadoDetalleReclamoRespuestaModel[];
    this.estados.set(this.estadosCompletos.map(e => ({
      valor:    e.idEstadoDetalleReclamo,
      etiqueta: e.descripcionEstadoDetalleReclamo,
    })));
  }

  private async cargarNiveles(): Promise<void> {
    const r = await this.detalleService.obtenerOrdenesNivel(this.idNivelProceso);
    const lista = r.Exito ? (r.Datos?.lista ?? (Array.isArray(r.Datos) ? r.Datos : [])) : [];
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

  private async cargarCliente(): Promise<void> {
    const r = await this.usuariosService.obtenerPorId(this.reclamo()!.idUsuarioExterno);
    if (r.Exito && r.Datos) this.cliente.set(r.Datos);
  }

  private async cargarDocumentos(): Promise<void> {
    const idReclamo = this.reclamo()!.id;
    const [extResp, intResp] = await Promise.all([
      this.reclamoService.obtenerDocumentosUsuario(idReclamo),
      this.detalleService.obtenerDocumentosPorIdReclamo(idReclamo),
    ]);

    this.documentosExternos.set(
      (extResp.Exito && extResp.Datos?.lista) ? extResp.Datos.lista : []
    );

    this.documentosInternos.set(
      (intResp.Exito && intResp.Datos?.lista) ? intResp.Datos.lista : []
    );
  }

  async guardar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid || !this.idDetalleReclamo) return;

    this.guardando.set(true);
    const { idEstado, idNivelSiguiente, descripcion, descripcionResolucion } = this.form.getRawValue();

    const editarResp = await this.detalleService.editar({
      IdDetalleReclamo:        this.idDetalleReclamo,
      IdEstadoDetalleReclamo:  idEstado!,
      IdNivelSiguienteProceso: idNivelSiguiente ?? undefined,
      IdUsuarioInterno:        this.idUsuarioInterno,
      Descripcion:             descripcion!,
      DescripcionResolucion:   descripcionResolucion!,
    });

    if (!editarResp.Exito) {
      this.guardando.set(false);
      this.popup.mostrar({ tipo: 'error', titulo: this.translate.instant('errores.titulo'), mensaje: editarResp.Mensaje });
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
