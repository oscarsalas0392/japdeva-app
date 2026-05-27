import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { ParametrosService } from '../../core/services/parametros.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginaComponent, IonIcon],
})
export class TerminosCondicionesPage implements OnInit {
  private readonly parametrosService = inject(ParametrosService);
  private readonly estadoService     = inject(EstadoAppService);

  readonly cargando  = signal(true);
  readonly contenido = signal('');

  constructor() {
    addIcons({ shieldCheckmarkOutline });
  }

  async ngOnInit(): Promise<void> {
    // Si hay versión cacheada, la mostramos de inmediato.
    const cacheado = await this.estadoService.obtener<string>(ClavesEstado.terminosCondiciones);
    if (cacheado) {
      this.contenido.set(cacheado);
      this.cargando.set(false);
    }

    // Refrescamos en background. Si la respuesta cambia, actualiza la vista.
    const terminosRespuesta = await this.parametrosService.obtenerParametroPorNombre('TerminosCondiciones');
    if (terminosRespuesta.Exito && terminosRespuesta.Datos) {
      const valor = terminosRespuesta.Datos.valor1;
      if (valor !== this.contenido()) {
        this.contenido.set(valor);
        await this.estadoService.guardar(ClavesEstado.terminosCondiciones, valor);
      }
    }
    this.cargando.set(false);
  }
}
