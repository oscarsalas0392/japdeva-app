import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline,
  sparklesOutline,
  searchOutline,
  constructOutline,
  helpBuoyOutline,
} from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { ParametrosService } from '../../core/services/parametros.service';
import { ParametroModel } from '../../core/models/parametros/parametro.model';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';

interface AyudaUsuarioInternoCache {
  bienvenidaTitulo: string;
  bienvenidaDescripcion: string;
  comoFuncionaTitulo: string;
  comoFuncionaPasos: string[];
  revisionTitulo: string;
  revisionPasos: string[];
  atencionTitulo: string;
  atencionPasos: string[];
  ayudaTitulo: string;
  ayudaDescripcion: string;
}

@Component({
  selector: 'app-informacion-usuario-interno',
  templateUrl: './informacion-usuario-interno.page.html',
  styleUrls: ['./informacion-usuario-interno.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, IonIcon, PaginaComponent],
})
export class InformacionUsuarioInternoPage implements OnInit {
  private readonly parametrosService = inject(ParametrosService);
  private readonly estadoService     = inject(EstadoAppService);

  constructor() {
    addIcons({ briefcaseOutline, sparklesOutline, searchOutline, constructOutline, helpBuoyOutline });
  }

  readonly cargando            = signal(true);
  readonly bienvenidaTitulo    = signal('');
  readonly bienvenidaDescripcion = signal('');
  readonly comoFuncionaTitulo  = signal('');
  readonly comoFuncionaPasos   = signal<string[]>([]);
  readonly revisionTitulo      = signal('');
  readonly revisionPasos       = signal<string[]>([]);
  readonly atencionTitulo      = signal('');
  readonly atencionPasos       = signal<string[]>([]);
  readonly ayudaTitulo         = signal('');
  readonly ayudaDescripcion    = signal('');

  async ngOnInit(): Promise<void> {
    const cacheado = await this.estadoService.obtener<AyudaUsuarioInternoCache>(ClavesEstado.ayudaUsuarioInterno);
    if (cacheado) {
      this.aplicar(cacheado);
      this.cargando.set(false);
    }

    const respuesta = await this.parametrosService.obtenerParametrosPorNombres([
      'AyudaInternaBienvenida',
      'AyudaInternaComoFuncionaTitulo',
      'AyudaInternaComoFunciona1', 'AyudaInternaComoFunciona2', 'AyudaInternaComoFunciona3',
      'AyudaInternaComoFunciona4', 'AyudaInternaComoFunciona5',
      'AyudaInternaRevisionTitulo',
      'AyudaInternaRevision1', 'AyudaInternaRevision2', 'AyudaInternaRevision3',
      'AyudaInternaAtencionTitulo',
      'AyudaInternaAtencion1', 'AyudaInternaAtencion2', 'AyudaInternaAtencion3', 'AyudaInternaAtencion4',
      'AyudaInternaAyuda',
    ]);

    const datos: AyudaUsuarioInternoCache = {
      bienvenidaTitulo:     '',
      bienvenidaDescripcion:'',
      comoFuncionaTitulo:   '',
      comoFuncionaPasos:    [],
      revisionTitulo:       '',
      revisionPasos:        [],
      atencionTitulo:       '',
      atencionPasos:        [],
      ayudaTitulo:          '',
      ayudaDescripcion:     '',
    };

    if (respuesta.Exito && Array.isArray(respuesta.Datos)) {
      const p = respuesta.Datos;
      datos.bienvenidaTitulo     = this.encontrar(p, 'AyudaInternaBienvenida', 'valor1');
      datos.bienvenidaDescripcion= this.encontrar(p, 'AyudaInternaBienvenida', 'valor2');
      datos.comoFuncionaTitulo   = this.encontrar(p, 'AyudaInternaComoFuncionaTitulo', 'valor1');
      datos.comoFuncionaPasos    = this.extraerPasos(p, 'AyudaInternaComoFunciona', 5);
      datos.revisionTitulo       = this.encontrar(p, 'AyudaInternaRevisionTitulo', 'valor1');
      datos.revisionPasos        = this.extraerPasos(p, 'AyudaInternaRevision', 3);
      datos.atencionTitulo       = this.encontrar(p, 'AyudaInternaAtencionTitulo', 'valor1');
      datos.atencionPasos        = this.extraerPasos(p, 'AyudaInternaAtencion', 4);
      datos.ayudaTitulo          = this.encontrar(p, 'AyudaInternaAyuda', 'valor1');
      datos.ayudaDescripcion     = this.encontrar(p, 'AyudaInternaAyuda', 'valor2');
    }

    if (JSON.stringify(datos) !== JSON.stringify(cacheado)) {
      this.aplicar(datos);
      await this.estadoService.guardar(ClavesEstado.ayudaUsuarioInterno, datos);
    }

    this.cargando.set(false);
  }

  private aplicar(datos: AyudaUsuarioInternoCache): void {
    this.bienvenidaTitulo.set(datos.bienvenidaTitulo);
    this.bienvenidaDescripcion.set(datos.bienvenidaDescripcion);
    this.comoFuncionaTitulo.set(datos.comoFuncionaTitulo);
    this.comoFuncionaPasos.set(datos.comoFuncionaPasos);
    this.revisionTitulo.set(datos.revisionTitulo);
    this.revisionPasos.set(datos.revisionPasos);
    this.atencionTitulo.set(datos.atencionTitulo);
    this.atencionPasos.set(datos.atencionPasos);
    this.ayudaTitulo.set(datos.ayudaTitulo);
    this.ayudaDescripcion.set(datos.ayudaDescripcion);
  }

  private encontrar(lista: ParametroModel[], nombre: string, campo: 'valor1' | 'valor2'): string {
    return lista.find(p => p.nombre === nombre)?.[campo] ?? '';
  }

  private extraerPasos(lista: ParametroModel[], prefijo: string, cantidad: number): string[] {
    const pasos: string[] = [];
    for (let i = 1; i <= cantidad; i++) {
      const valor = this.encontrar(lista, `${prefijo}${i}`, 'valor1');
      if (valor) pasos.push(valor);
    }
    return pasos;
  }
}
