import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaContactoComponent } from '../../components/tarjeta-contacto/tarjeta-contacto.component';
import { TarjetaOficinaComponent } from '../../components/tarjeta-oficina/tarjeta-oficina.component';
import { ListaFaqsComponent, FaqItem } from '../../components/lista-faqs/lista-faqs.component';
import { GridColumnasComponent } from '../../components/grid-columnas/grid-columnas.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { ParametrosService } from '../../core/services/parametros.service';
import { ParametrosCacheService } from '../../core/services/parametros-cache.service';
import { ParametroModel } from '../../core/models/parametros/parametro.model';
import { ClavesEstado } from '../../core/state/claves-estado';

interface InformacionContactoCache {
  telefono: string;
  email: string;
  nombreOficina: string;
  direccion: string;
  horario: string;
  faqs: FaqItem[];
}

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginaComponent, TarjetaContactoComponent, TarjetaOficinaComponent, ListaFaqsComponent, GridColumnasComponent, GrupoCampoComponent],
})
export class InformacionPage implements OnInit {
  private readonly parametrosService = inject(ParametrosService);
  private readonly cache             = inject(ParametrosCacheService);

  readonly cargando      = signal(true);
  readonly telefono      = signal('');
  readonly email         = signal('');
  readonly nombreOficina = signal('');
  readonly direccion     = signal('');
  readonly horario       = signal('');
  readonly faqs          = signal<FaqItem[]>([]);

  async ngOnInit(): Promise<void> {
    await this.cache.cargarConCache<InformacionContactoCache>(
      ClavesEstado.informacionContacto,
      () => this.obtenerDelApi(),
      (datos) => {
        this.aplicar(datos);
        this.cargando.set(false);
      },
    );
    this.cargando.set(false);
  }

  private async obtenerDelApi(): Promise<InformacionContactoCache | null> {
    const [contacto, faqsResp] = await Promise.all([
      this.parametrosService.obtenerParametrosPorNombres([
        'TelefonoContacto', 'EmailContacto', 'NombreOficina', 'DireccionOficina', 'HorarioOficina',
      ]),
      this.parametrosService.obtenerParametrosPorNombres([
        'FaqCrearReclamo', 'FaqTiempoResolucion', 'FaqDocumentos', 'FaqSeguimiento',
      ]),
    ]);

    if (!contacto.Exito && !faqsResp.Exito) return null;

    const datos: InformacionContactoCache = {
      telefono:      '',
      email:         '',
      nombreOficina: '',
      direccion:     '',
      horario:       '',
      faqs:          [],
    };

    if (contacto.Exito && Array.isArray(contacto.Datos)) {
      datos.telefono      = this.encontrar(contacto.Datos, 'TelefonoContacto');
      datos.email         = this.encontrar(contacto.Datos, 'EmailContacto');
      datos.nombreOficina = this.encontrar(contacto.Datos, 'NombreOficina');
      datos.direccion     = this.encontrar(contacto.Datos, 'DireccionOficina');
      datos.horario       = this.encontrar(contacto.Datos, 'HorarioOficina');
    }

    if (faqsResp.Exito && Array.isArray(faqsResp.Datos)) {
      datos.faqs = faqsResp.Datos.map(p => ({
        pregunta:  p.valor1,
        respuesta: p.valor2 ?? '',
      }));
    }

    return datos;
  }

  private aplicar(datos: InformacionContactoCache): void {
    this.telefono.set(datos.telefono);
    this.email.set(datos.email);
    this.nombreOficina.set(datos.nombreOficina);
    this.direccion.set(datos.direccion);
    this.horario.set(datos.horario);
    this.faqs.set(datos.faqs);
  }

  private encontrar(lista: ParametroModel[], nombre: string): string {
    return lista.find(p => p.nombre === nombre)?.valor1 ?? '';
  }
}
