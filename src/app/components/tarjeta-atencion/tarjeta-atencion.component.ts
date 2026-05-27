import { Component, inject, Input } from '@angular/core';
import { addIcons } from 'ionicons';
import { personOutline, businessOutline, calendarOutline, documentTextOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { TarjetaComponent } from '../tarjeta/tarjeta.component';
import { FilaComponent } from '../fila/fila.component';
import { GeneralesService } from '../../core/services/generales.service';
import { DocumentoInternoRespuestaModel } from '../../core/models/reclamos/documento-interno.model';

@Component({
  selector: 'app-tarjeta-atencion',
  templateUrl: './tarjeta-atencion.component.html',
  styleUrls: ['./tarjeta-atencion.component.scss'],
  standalone: true,
  imports: [TranslateModule, TarjetaComponent, FilaComponent],
})
export class TarjetaAtencionComponent {
  @Input() atencion!: DocumentoInternoRespuestaModel;

  readonly generales = inject(GeneralesService);

  constructor() {
    addIcons({ personOutline, businessOutline, calendarOutline, documentTextOutline });
  }

  get fechaInicioFormateada(): string {
    return this.generales.formatearFecha(this.atencion.fechaInicio ?? null);
  }

  get fechaFinFormateada(): string {
    return this.generales.formatearFecha(this.atencion.fechaFin ?? null);
  }
}
