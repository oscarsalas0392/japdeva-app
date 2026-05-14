import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { CampoSelectComponent } from '../../components/campo-select/campo-select.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { TranslateService } from '@ngx-translate/core';
import { UsuariosService } from '../../core/services/usuarios.service';
import { TipoCedulaRespuestaModel } from '../../core/models/usuarios/tipo-cedula.model';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

@Component({
  selector: 'app-buscar-usuario-cedula',
  templateUrl: './buscar-usuario-cedula.page.html',
  styleUrls: ['./buscar-usuario-cedula.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule, PaginaComponent, CampoFormularioComponent, CampoSelectComponent, BotonCargandoComponent],
})
export class BuscarUsuarioCedulaPage implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly popup           = inject(PopupAvisoService);
  private readonly translate       = inject(TranslateService);
  private readonly router          = inject(Router);
  private readonly fb              = inject(FormBuilder);

  readonly buscando    = signal(false);
  readonly cargando    = signal(true);
  readonly tiposCedula = signal<OpcionSelectModel[]>([]);
  readonly paginaLista = signal(false);

  enviado = false;

  private tipos: TipoCedulaRespuestaModel[] = [];

  readonly form = this.fb.group({
    idTipoCedula: [<number | null>null, [Validators.required]],
    cedula:       ['', [Validators.required]],
  });

  async ngOnInit(): Promise<void> {
    try
    {
      const r = await this.usuariosService.obtenerTiposCedula();
      if (r.Exito && Array.isArray(r.Datos)) {
        this.tipos = r.Datos.filter(t => t.activo);
        this.tiposCedula.set(this.tipos.map(t => ({ valor: t.id, etiqueta: t.tipo })));
      }
      this.cargando.set(false);
    }
    catch(error)
    {
      this.cargando.set(false);
      console.log(error)
    }
  }

  ionViewDidEnter(): void {
    this.paginaLista.set(true);
  }

  ionViewWillLeave(): void {
    this.paginaLista.set(false);
    this.form.reset();
    this.enviado = false;
  }

  async buscar(): Promise<void> {
    this.enviado = true;

    if (this.form.invalid) return;

    const { idTipoCedula, cedula } = this.form.getRawValue();
    const tipo = this.tipos.find(t => t.id === idTipoCedula);

    if (tipo?.formato) {
      const regex = new RegExp(tipo.formato);
      if (!regex.test(cedula!.trim())) {
        this.popup.mostrar({
          tipo: 'error',
          titulo: this.translate.instant('buscarUsuarioCedula.formatoInvalido'),
          mensaje: this.translate.instant('buscarUsuarioCedula.formatoInvalidoDesc', { tipo: tipo.tipo }),
        });
        return;
      }
    }

    this.buscando.set(true);
    const r = await this.usuariosService.obtenerPorIdentificacion(cedula!.trim());
    this.buscando.set(false);

    if (!r.Exito || !r.Datos) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('buscarUsuarioCedula.sinResultados'),
        mensaje: this.translate.instant('buscarUsuarioCedula.sinResultadosDesc'),
      });
      return;
    }

    this.router.navigate(['/gestion-usuarios'], { state: { usuario: r.Datos } });
  }
}
