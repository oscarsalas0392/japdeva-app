import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { CampoDetalleComponent } from '../../components/campo-detalle/campo-detalle.component';
import { ListaDocumentosComponent } from '../../components/lista-documentos/lista-documentos.component';
import { TabsComponent, TabItem } from '../../components/tabs/tabs.component';
import { ReclamoService } from '../../core/services/reclamo.service';
import { DetalleReclamoService } from '../../core/services/detalle-reclamo.service';
import { GeneralesService } from '../../core/services/generales.service';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { DetalleReclamoRespuestaModel } from '../../core/models/reclamos/detalle-reclamo.model';
import { DocumentoUsuarioRespuestaModel } from '../../core/models/reclamos/documento-usuario-respuesta.model';

@Component({
  selector: 'app-detalle-reclamo',
  templateUrl: './detalle-reclamo.page.html',
  styleUrls: ['./detalle-reclamo.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, PaginaComponent, CampoDetalleComponent, ListaDocumentosComponent, TabsComponent],
})
export class DetalleReclamoPage implements OnInit {
  private readonly reclamoService  = inject(ReclamoService);
  private readonly detalleService  = inject(DetalleReclamoService);
  private readonly route           = inject(ActivatedRoute);
  readonly generales               = inject(GeneralesService);

  readonly reclamo    = signal<ReclamoRespuestaModel | null>(null);
  readonly historial  = signal<DetalleReclamoRespuestaModel[]>([]);
  readonly documentos = signal<DocumentoUsuarioRespuestaModel[]>([]);
  readonly cargando   = signal(true);
  readonly tabActivo  = signal('general');

  readonly tabs: TabItem[] = [
    { id: 'general',    etiqueta: 'detalleReclamo.tabGeneral'    },
    { id: 'documentos', etiqueta: 'detalleReclamo.tabDocumentos' },
  ];

  private idReclamo = 0;

  async ngOnInit(): Promise<void> {
    this.idReclamo = Number(this.route.snapshot.paramMap.get('id'));
    const nav = history.state;
    if (nav?.reclamo) this.reclamo.set(nav.reclamo);
    await Promise.all([this.cargarDocumentos(), this.cargarHistorial()]);
    this.cargando.set(false);
  }

  private async cargarDocumentos(): Promise<void> {
    const documentosRespuesta = await this.reclamoService.obtenerDocumentosUsuario(this.idReclamo);
    if (documentosRespuesta.Exito && documentosRespuesta.Datos?.lista) this.documentos.set(documentosRespuesta.Datos.lista);
  }

  private async cargarHistorial(): Promise<void> {
    const historialRespuesta = await this.detalleService.obtenerHistorico(this.idReclamo);
    if (historialRespuesta.Exito && historialRespuesta.Datos?.lista) this.historial.set(historialRespuesta.Datos.lista);
  }

  get codigo(): string {
    const reclamoActual = this.reclamo();
    return reclamoActual ? this.generales.codigoReclamo(reclamoActual.id, reclamoActual.fechaRegistro) : '';
  }

  get estadoActual() {
    const historialActual = this.historial();
    return historialActual.length ? historialActual[historialActual.length - 1] : null;
  }

}
