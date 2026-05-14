import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { CampoDetalleComponent } from '../../components/campo-detalle/campo-detalle.component';
import { ListaDocumentosComponent } from '../../components/lista-documentos/lista-documentos.component';
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
  imports: [TranslateModule, IonIcon, PaginaComponent, CampoDetalleComponent, ListaDocumentosComponent],
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

  private idReclamo = 0;

  constructor() {
    addIcons({ documentOutline });
  }

  async ngOnInit(): Promise<void> {
    this.idReclamo = Number(this.route.snapshot.paramMap.get('id'));
    const nav = history.state;
    if (nav?.reclamo) this.reclamo.set(nav.reclamo);
    await Promise.all([this.cargarDocumentos(), this.cargarHistorial()]);
    this.cargando.set(false);
  }

  private async cargarDocumentos(): Promise<void> {
    const r = await this.reclamoService.obtenerDocumentosUsuario(this.idReclamo);
    if (r.Exito && r.Datos?.lista) this.documentos.set(r.Datos.lista);
  }

  private async cargarHistorial(): Promise<void> {
    const r = await this.detalleService.obtenerHistorico(this.idReclamo);
    if (r.Exito && r.Datos?.lista) this.historial.set(r.Datos.lista);
  }

  get codigo(): string {
    const r = this.reclamo();
    return r ? this.generales.codigoReclamo(r.id, r.fechaRegistro) : '';
  }

  get estadoActual() {
    const h = this.historial();
    return h.length ? h[h.length - 1] : null;
  }

  get claseEstado(): string {
    return this.generales.claseEstadoReclamo(this.reclamo()?.idEstadoReclamo ?? 0);
  }
}
