import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { attachOutline, documentOutline, closeCircleOutline } from 'ionicons/icons';
import { ArchivoSolicitudModel } from '../../core/models/reclamos/documento.model';

@Component({
  selector: 'app-adjuntar-archivo',
  templateUrl: './adjuntar-archivo.component.html',
  styleUrls: ['./adjuntar-archivo.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonIcon],
})
export class AdjuntarArchivoComponent {
  @Input() label = 'adjuntarArchivo.label';
  @Input() accept = '.pdf,application/pdf';
  @Input() archivo: ArchivoSolicitudModel | null = null;
  @Input() requerido = false;
  @Input() enviado = false;
  @Output() archivoChange = new EventEmitter<ArchivoSolicitudModel | null>();

  get invalido(): boolean {
    return this.requerido && this.enviado && !this.archivo;
  }

  constructor() {
    addIcons({ attachOutline, documentOutline, closeCircleOutline });
  }

  async seleccionar(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;
    const base64 = await this.leerComoBase64(file);
    this.archivoChange.emit({ NombreArchivo: file.name, ContenidoArchivo: base64 });
    input.value = '';
  }

  eliminar(e: Event): void {
    e.stopPropagation();
    this.archivoChange.emit(null);
  }

  private leerComoBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
