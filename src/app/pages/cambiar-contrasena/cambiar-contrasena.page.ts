import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { AuthService } from '../../core/services/auth.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';

function contrasenasCoincidenValidator(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('nueva');
  const confirmar = control.get('confirmar');
  if (!nueva || !confirmar) return null;

  if (nueva.value && confirmar.value && nueva.value !== confirmar.value) {
    confirmar.setErrors({ ...confirmar.errors, noCoinciden: true });
  } else if (confirmar.errors?.['noCoinciden']) {
    const { noCoinciden, ...resto } = confirmar.errors;
    confirmar.setErrors(Object.keys(resto).length ? resto : null);
  }
  return null;
}

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PaginaComponent,
    TarjetaComponent,
    AvisoComponent,
    GrupoCampoComponent,
    CampoFormularioComponent,
    BotonCargandoComponent,
  ],
})
export class CambiarContrasenaPage {
  private readonly authService = inject(AuthService);
  private readonly estadoService = inject(EstadoAppService);
  private readonly popup = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    actual:    ['', [Validators.required, Validators.minLength(8)]],
    nueva:     ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmar: ['', [Validators.required]],
  }, { validators: contrasenasCoincidenValidator });

  readonly avisoItems = [
    'cambiarContrasena.avisoItems.0',
    'cambiarContrasena.avisoItems.1',
    'cambiarContrasena.avisoItems.2',
  ];

  cargando = false;
  enviado = false;

  get confirmarInvalido(): boolean {
    return this.enviado && this.form.get('confirmar')!.invalid;
  }

  async enviar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid) return;

    this.cargando = true;
    this.form.disable();

    const usuario = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    const { actual, nueva } = this.form.getRawValue();

    const respuesta = await this.authService.cambiarContrasena({
      Id: usuario!.id,
      ContrasenaAnterior: actual!,
      ContrasenaNueva: nueva!,
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: this.translate.instant('cambiarContrasena.error'),
      });
      return;
    }

    this.popup.mostrar({
      tipo: 'exito',
      titulo: this.translate.instant('exito.titulo'),
      mensaje: this.translate.instant('cambiarContrasena.exito'),
    });

    this.router.navigate(['/perfil'], { replaceUrl: true });
  }
}
