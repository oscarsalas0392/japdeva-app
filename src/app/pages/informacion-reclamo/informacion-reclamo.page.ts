import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, personOutline, attachOutline, businessOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { FilaComponent } from '../../components/fila/fila.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { ListaDocumentosComponent } from '../../components/lista-documentos/lista-documentos.component';
import { ExpedienteDigitalComponent } from '../../components/expediente-digital/expediente-digital.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { TabsComponent, TabItem } from '../../components/tabs/tabs.component';
import { TarjetaAtencionComponent } from '../../components/tarjeta-atencion/tarjeta-atencion.component';
import { UsuariosService } from '../../core/services/usuarios.service';
import { GeneralesService } from '../../core/services/generales.service';
import { ParametrosService } from '../../core/services/parametros.service';
import { DocumentosReclamoService } from '../../core/services/documentos-reclamo.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { UsuarioRespuestaModel } from '../../core/models/usuarios/usuario.model';
import { DocumentoUsuarioRespuestaModel } from '../../core/models/reclamos/documento-usuario-respuesta.model';
import { DocumentoInternoRespuestaModel } from '../../core/models/reclamos/documento-interno.model';
import { EstadoDetalleReclamoEnum } from '../../core/models/reclamos/estado-detalle-reclamo.enum';

@Component({
  selector: 'app-informacion-reclamo',
  templateUrl: './informacion-reclamo.page.html',
  styleUrls: ['./informacion-reclamo.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    IonIcon,
    PaginaComponent,
    TarjetaComponent,
    FilaComponent,
    SeccionHeaderComponent,
    ListaDocumentosComponent,
    ExpedienteDigitalComponent,
    GrupoCampoComponent,
    TabsComponent,
    TarjetaAtencionComponent,
  ],
})
export class InformacionReclamoPage implements OnInit {
  private readonly documentosReclamo = inject(DocumentosReclamoService);
  private readonly usuariosService   = inject(UsuariosService);
  private readonly parametrosService = inject(ParametrosService);
  private readonly estadoService     = inject(EstadoAppService);
  readonly generales                 = inject(GeneralesService);

  readonly cargando           = signal(true);
  readonly tabActivo          = signal('general');
  readonly reclamo            = signal<ReclamoRespuestaModel | null>(null);
  readonly cliente            = signal<UsuarioRespuestaModel | null>(null);
  readonly documentosExternos = signal<DocumentoUsuarioRespuestaModel[]>([]);
  readonly documentosInternos      = signal<DocumentoInternoRespuestaModel[]>([]);
  readonly nombreDepartamentoActual = signal('');
  readonly tabs                    = signal<TabItem[]>([]);

  private readonly BASE_TABS: TabItem[] = [
    { id: 'general',    etiqueta: 'informacionReclamo.tabGeneral'    },
    { id: 'expediente', etiqueta: 'informacionReclamo.tabExpediente' },
  ];

  private readonly TAB_ATENCION: TabItem = { id: 'atencion', etiqueta: 'informacionReclamo.tabAtencion' };

  constructor() {
    addIcons({ documentTextOutline, personOutline, attachOutline, businessOutline });
  }

  readonly atenciones = computed(() =>
    this.documentosInternos().filter(documento => !!documento.nombreUsuarioInterno && !!documento.descripcionDetalleReclamo)
  );

  /** El reclamo se considera no atendido solo cuando su estado detalle sigue en Pendiente. */
  readonly reclamoSinAtender = computed(() =>
    this.reclamo()?.idEstadoDetalleReclamo === EstadoDetalleReclamoEnum.Pendiente
  );

  async ngOnInit(): Promise<void> {
    const nav = history.state;
    if (nav?.reclamo) this.reclamo.set(nav.reclamo);

    try {
      const tareas: Promise<void>[] = [this.cargarTabs().catch(() => { this.tabs.set(this.BASE_TABS); })];
      if (this.reclamo()) {
        tareas.push(this.cargarCliente().catch(() => {}));
        tareas.push(this.cargarDocumentos().catch(() => {}));
      }
      await Promise.all(tareas);
    } finally {
      this.cargando.set(false);
    }
  }

  private async cargarTabs(): Promise<void> {
    const idRol = await this.estadoService.obtener<number>(ClavesEstado.idRol);
    const tabsActivos = [...this.BASE_TABS];
    if (idRol) {
      const respuesta = await this.parametrosService.obtenerOpcionPantallaPorPerfil(idRol);
      if (respuesta.Exito && respuesta.Datos?.some(o => o.nombre === 'TabAtencionReclamo')) {
        tabsActivos.push(this.TAB_ATENCION);
      }
    }
    this.tabs.set(tabsActivos);
  }

  private async cargarCliente(): Promise<void> {
    const clienteRespuesta = await this.usuariosService.obtenerPorId(this.reclamo()!.idUsuarioExterno);
    if (clienteRespuesta.Exito && clienteRespuesta.Datos) this.cliente.set(clienteRespuesta.Datos);
  }

  private async cargarDocumentos(): Promise<void> {
    const reclamoActual = this.reclamo()!;
    const { externos, internosCerrados, departamentoActual } =
      await this.documentosReclamo.cargarTodos(reclamoActual.id);

    this.documentosExternos.set(externos);
    this.documentosInternos.set(internosCerrados);
    this.nombreDepartamentoActual.set(
      departamentoActual ?? reclamoActual.descripcionDepartamento ?? '',
    );
  }
}
