import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { ParametrosService } from '../../core/services/parametros.service';
import { ParametrosCacheService } from '../../core/services/parametros-cache.service';
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
  private readonly cache             = inject(ParametrosCacheService);

  readonly cargando  = signal(true);
  readonly contenido = signal('');

  constructor() {
    addIcons({ shieldCheckmarkOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.cache.cargarConCache<string>(
      ClavesEstado.terminosCondiciones,
      async () => {
        const respuesta = await this.parametrosService.obtenerParametroPorNombre('TerminosCondiciones');
        return respuesta.Exito ? respuesta.Datos?.valor1 ?? null : null;
      },
      (texto) => {
        this.contenido.set(texto);
        this.cargando.set(false);
      },
    );
    this.cargando.set(false);
  }
}
