import { Component, Input, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PopupAvisoService } from '../popup-aviso/popup-aviso.service';
import { DocumentoUsuarioRespuestaModel } from '../../core/models/reclamos/documento-usuario-respuesta.model';

@Component({
  selector: 'app-lista-documentos',
  templateUrl: './lista-documentos.component.html',
  styleUrls: ['./lista-documentos.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonIcon, IonSpinner],
})
export class ListaDocumentosComponent {
  @Input() documentos: DocumentoUsuarioRespuestaModel[] = [];
  @Input() titulo = 'detalleReclamo.documentos';

  private readonly popup     = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);

  readonly descargando = signal<number | null>(null);

  constructor() {
    addIcons({ cloudDownloadOutline });
  }

  tamanoArchivo(base64: string): string {
    const bytes = Math.round((base64.length * 3) / 4 / 1024);
    return bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} MB` : `${bytes} KB`;
  }

  async descargar(doc: DocumentoUsuarioRespuestaModel): Promise<void> {
    this.descargando.set(doc.id);
    try {
      // Limpiar prefijo data URI si viene incluido
      const base64 = doc.documento.includes(',')
        ? doc.documento.split(',')[1]
        : doc.documento;

      // Guardar en la carpeta Descargas pública del dispositivo
      await Filesystem.writeFile({
        path:      `Download/${doc.nombreDocumento}`,
        data:      base64,
        directory: Directory.ExternalStorage,
        recursive: true,
      });

      this.popup.mostrar({
        tipo:    'exito',
        titulo:  this.translate.instant('exito.titulo'),
        mensaje: this.translate.instant('detalleReclamo.descargaExito', {
          nombre: doc.nombreDocumento,
        }),
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
