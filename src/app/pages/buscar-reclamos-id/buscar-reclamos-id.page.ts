import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { ReclamoService } from '../../core/services/reclamo.service';

@Component({
  selector: 'app-buscar-reclamos-id',
  templateUrl: './buscar-reclamos-id.page.html',
  styleUrls: ['./buscar-reclamos-id.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PaginaComponent,
    TarjetaComponent,
    SeccionHeaderComponent,
    GrupoCampoComponent,
    CampoFormularioComponent,
    BotonCargandoComponent,
  ],
})
export class BuscarReclamosIdPage {
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
    idReclamo: [<number | null>null, [Validators.required, Validators.min(1)]],
  });

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

    const { idReclamo } = this.form.getRawValue();

    this.buscando.set(true);
    this.cdr.markForCheck();
    const respuesta = await this.reclamoService.obtenerPorId(idReclamo!);
    this.buscando.set(false);
    this.cdr.markForCheck();

    if (respuesta.Manejado) return;
    if (!respuesta.Exito || !respuesta.Datos) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: this.translate.instant('buscarReclamosId.sinResultados'),
      });
      return;
    }

    const reclamo = respuesta.Datos;
    this.router.navigate(['/informacion-reclamo', reclamo.id], { state: { reclamo } });
  }
}
