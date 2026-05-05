import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { CampoDetalleComponent } from '../../components/campo-detalle/campo-detalle.component';
import { ListaDocumentosComponent } from '../../components/lista-documentos/lista-documentos.component';
import { ReclamoService } from '../../core/services/reclamo.service';
import { DetalleReclamoService } from '../../core/services/detalle-reclamo.service';
import { ReclamoRespuestaModel } from '../../core/models/reclamos/reclamo.model';
import { DetalleReclamoRespuestaModel } from '../../core/models/reclamos/detalle-reclamo.model';
import { DocumentoUsuarioRespuestaModel } from '../../core/models/reclamos/documento-usuario-respuesta.model';

@Component({
  selector: 'app-detalle-reclamo',
  templateUrl: './detalle-reclamo.page.html',
  styleUrls: ['./detalle-reclamo.page.scss'],
  standalone: true,
  imports: [TranslateModule, IonSpinner, IonIcon, PaginaComponent, CampoDetalleComponent, ListaDocumentosComponent],
})
export class DetalleReclamoPage implements OnInit {
  private readonly reclamoService = inject(ReclamoService);
  private readonly detalleService = inject(DetalleReclamoService);
  private readonly route          = inject(ActivatedRoute);

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
  }

  private async cargarDocumentos(): Promise<void> {
    const r = await this.reclamoService.obtenerDocumentosUsuario(this.idReclamo);
    if (r.Exito && r.Datos?.lista) this.documentos.set(r.Datos.lista);
  }

  private async cargarHistorial(): Promise<void> {
    this.cargando.set(true);
    const r = await this.detalleService.obtenerHistorico(this.idReclamo);
    if (r.Exito && r.Datos?.lista) this.historial.set(r.Datos.lista);
    this.cargando.set(false);
  }

  get codigo(): string {
    const id = this.reclamo()?.id;
    return id ? `RC-${String(id).padStart(4, '0')}` : '';
  }

  formatearFecha(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  clasePunto(index: number): string {
    if (index === this.historial().length - 1) return 'punto--actual';
    return 'punto--completado';
  }
}
