import { Component, Input, inject, signal, computed } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { buildOutline, cloudDownloadOutline, documentTextOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PopupAvisoService } from '../popup-aviso/popup-aviso.service';
import { DocumentoInternoRespuestaModel } from '../../core/models/reclamos/documento-interno.model';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-expediente-digital',
  templateUrl: './expediente-digital.component.html',
  styleUrls: ['./expediente-digital.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonIcon, IonSpinner],
})
export class ExpedienteDigitalComponent {
  @Input() documentos: DocumentoInternoRespuestaModel[] = [];

  private readonly popup     = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);

  readonly descargando  = signal<number | null>(null);
  readonly expandido    = signal(false);

  /** Solo se muestran documentos que tengan una descripción asociada. */
  private get documentosConDescripcion(): DocumentoInternoRespuestaModel[] {
    return this.documentos.filter(d => !!d.descripcionDetalleReclamo?.trim());
  }

  get visibles(): DocumentoInternoRespuestaModel[] {
    const lista = this.documentosConDescripcion;
    return this.expandido() ? lista : lista.slice(0, PAGE_SIZE);
  }

  get hayMas(): boolean {
    return this.documentosConDescripcion.length > PAGE_SIZE;
  }

  get restantes(): number {
    return this.documentosConDescripcion.length - PAGE_SIZE;
  }

  get vacio(): boolean {
    return this.documentosConDescripcion.length === 0;
  }

  constructor() {
    addIcons({ cloudDownloadOutline, documentTextOutline, buildOutline, chevronDownOutline, chevronUpOutline });
  }

  tamanoArchivo(base64: string): string {
    if (!base64) return '';
    const bytes = Math.round((base64.length * 3) / 4 / 1024);
    return bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} MB` : `${bytes} KB`;
  }

  async descargar(doc: DocumentoInternoRespuestaModel): Promise<void> {
    this.descargando.set(doc.id);
    try {
      const base64 = doc.documento.includes(',')
        ? doc.documento.split(',')[1]
        : doc.documento;

      await Filesystem.writeFile({
        path:      `Download/${doc.nombreDocumento}`,
        data:      base64,
        directory: Directory.ExternalStorage,
        recursive: true,
      });

      this.popup.mostrar({
        tipo:    'exito',
        titulo:  this.translate.instant('exito.titulo'),
        mensaje: this.translate.instant('detalleReclamo.descargaExito', { nombre: doc.nombreDocumento }),
      });
    } catch (e: any) {
      this.popup.mostrar({
        tipo:    'error',
        titulo:  this.translate.instant('errores.titulo'),
        mensaje: e?.message ?? this.translate.instant('detalleReclamo.errorDescarga'),
      });
    } finally {
      this.descargando.set(null);
    }
  }
}
