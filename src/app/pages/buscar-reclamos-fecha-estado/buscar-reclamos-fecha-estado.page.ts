import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { CampoFechaComponent } from '../../components/campo-fecha/campo-fecha.component';
import { CampoSelectComponent } from '../../components/campo-select/campo-select.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { ReclamoService } from '../../core/services/reclamo.service';
import { EstadoReclamoEnum } from '../../core/models/reclamos/estado-reclamo.enum';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

@Component({
  selector: 'app-buscar-reclamos-fecha-estado',
  templateUrl: './buscar-reclamos-fecha-estado.page.html',
  styleUrls: ['./buscar-reclamos-fecha-estado.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PaginaComponent,
    TarjetaComponent,
    SeccionHeaderComponent,
    GrupoCampoComponent,
    CampoFechaComponent,
    CampoSelectComponent,
    BotonCargandoComponent,
  ],
})
export class BuscarReclamosFechaEstadoPage {
  private readonly reclamoService = inject(ReclamoService);
  private readonly popup          = inject(PopupAvisoService);
  private readonly translate      = inject(TranslateService);
  private readonly router         = inject(Router);
  private readonly fb             = inject(FormBuilder);
  private readonly cdr            = inject(ChangeDetectorRef);

  readonly buscando    = signal(false);
  readonly paginaLista = signal(false);

  enviado = false;

  readonly form = this.fb.group({
    fechaInicio: [<string | null>null, [Validators.required]],
    fechaFin:    [<string | null>null],
    idEstado:    [<number | null>null, [Validators.required]],
  });

  readonly estados: OpcionSelectModel[] = [
    { valor: EstadoReclamoEnum.Pendiente,  etiqueta: 'Pendiente'  },
    { valor: EstadoReclamoEnum.EnProceso,  etiqueta: 'En proceso' },
    { valor: EstadoReclamoEnum.Completado, etiqueta: 'Completado' },
    { valor: EstadoReclamoEnum.Rechazado,  etiqueta: 'Rechazado'  },
  ];

  ionViewDidEnter(): void {
    this.paginaLista.set(true);
    this.cdr.markForCheck();
  }

  ionViewWillLeave(): void {
    this.paginaLista.set(false);
    this.form.reset();
    this.enviado = false;
    this.cdr.markForCheck();
  }

  async buscar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid) return;

    const { fechaInicio, fechaFin, idEstado } = this.form.getRawValue();

    if (fechaFin && new Date(fechaInicio!) > new Date(fechaFin)) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: this.translate.instant('buscarReclamosFechaEstado.fechasInvalidas'),
      });
      return;
    }

    this.buscando.set(true);
    this.cdr.markForCheck();
    const respuesta = await this.reclamoService.obtenerPorFechaEstado(fechaInicio!, fechaFin, idEstado!);
    this.buscando.set(false);
    this.cdr.markForCheck();

    if (respuesta.Manejado) return;
    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje || this.translate.instant('errores.conexion'),
      });
      return;
    }

    const reclamos = respuesta.Datos?.lista ?? [];
    this.router.navigate(['/resultados-reclamos'], { state: { reclamos } });
  }
}
