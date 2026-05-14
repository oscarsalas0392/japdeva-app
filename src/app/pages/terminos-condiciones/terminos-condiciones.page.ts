import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { ParametrosService } from '../../core/services/parametros.service';

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

  readonly cargando  = signal(true);
  readonly contenido = signal('');

  constructor() {
    addIcons({ shieldCheckmarkOutline });
  }

  async ngOnInit(): Promise<void> {
    const r = await this.parametrosService.obtenerParametroPorNombre('TerminosCondiciones');
    if (r.Exito && r.Datos) this.contenido.set(r.Datos.valor1);
    this.cargando.set(false);
  }
}
