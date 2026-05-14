import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaContactoComponent } from '../../components/tarjeta-contacto/tarjeta-contacto.component';
import { TarjetaOficinaComponent } from '../../components/tarjeta-oficina/tarjeta-oficina.component';
import { ListaFaqsComponent, FaqItem } from '../../components/lista-faqs/lista-faqs.component';
import { GridColumnasComponent } from '../../components/grid-columnas/grid-columnas.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { ParametrosService } from '../../core/services/parametros.service';
import { ParametroModel } from '../../core/models/parametros/parametro.model';

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

  readonly cargando      = signal(true);
  readonly telefono      = signal('');
  readonly email         = signal('');
  readonly nombreOficina = signal('');
  readonly direccion     = signal('');
  readonly horario       = signal('');
  readonly faqs          = signal<FaqItem[]>([]);

  async ngOnInit(): Promise<void> {
    const [contacto, faqsResp] = await Promise.all([
      this.parametrosService.obtenerParametrosPorNombres([
        'TelefonoContacto', 'EmailContacto', 'NombreOficina', 'DireccionOficina', 'HorarioOficina',
      ]),
      this.parametrosService.obtenerParametrosPorNombres([
        'FaqCrearReclamo', 'FaqTiempoResolucion', 'FaqDocumentos', 'FaqSeguimiento',
      ]),
    ]);

    if (contacto.Exito && Array.isArray(contacto.Datos)) {
      this.telefono.set(this.encontrar(contacto.Datos, 'TelefonoContacto'));
      this.email.set(this.encontrar(contacto.Datos, 'EmailContacto'));
      this.nombreOficina.set(this.encontrar(contacto.Datos, 'NombreOficina'));
      this.direccion.set(this.encontrar(contacto.Datos, 'DireccionOficina'));
      this.horario.set(this.encontrar(contacto.Datos, 'HorarioOficina'));
    }

    if (faqsResp.Exito && Array.isArray(faqsResp.Datos)) {
      this.faqs.set(faqsResp.Datos.map(p => ({
        pregunta: p.valor1,
        respuesta: p.valor2 ?? '',
      })));
    }

    this.cargando.set(false);
  }

  private encontrar(lista: ParametroModel[], nombre: string): string {
    return lista.find(p => p.nombre === nombre)?.valor1 ?? '';
  }
}
