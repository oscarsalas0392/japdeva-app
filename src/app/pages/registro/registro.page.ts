import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AbstractControl, ReactiveFormsModule, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent } from '@ionic/angular/standalone';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { CampoFechaComponent } from '../../components/campo-fecha/campo-fecha.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { CampoSelectComponent } from '../../components/campo-select/campo-select.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { TipoCedulaRespuestaModel } from '../../core/models/usuarios/tipo-cedula.model';
import { OpcionSelectModel } from '../../core/models/opcion-select.model';

const contrasenaCoincideValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const contrasena = form.get('contrasena')?.value;
  const confirmar = form.get('confirmarContrasena')?.value;
  if (confirmar && contrasena !== confirmar) {
    form.get('confirmarContrasena')?.setErrors({ noCoincide: true });
    return { noCoincide: true };
  }
  if (form.get('confirmarContrasena')?.hasError('noCoincide')) {
    form.get('confirmarContrasena')?.setErrors(null);
  }
  return null;
};

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IonContent,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    CampoFechaComponent,
    CampoSelectComponent,
    GrupoCampoComponent,
    BotonCargandoComponent,
  ],
})
export class RegistroPage implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly popup = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tiposCedula = signal<TipoCedulaRespuestaModel[]>([]);
  readonly opcionesTipoCedula = signal<OpcionSelectModel[]>([]);
  readonly mensajeErrorIdentificacion = signal('registro.validacion.identificacionRequerida');

  readonly form = this.fb.group({
    idTipoCedula:        [<number | null>null, [Validators.required]],
    identificacion:      ['', [Validators.required]],
    nombre:              ['', [Validators.required]],
    apellidos:           ['', [Validators.required]],
    correo:              ['', [Validators.required, Validators.email]],
    telefono:            ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    fechaNacimiento:     [<string | null>null, [Validators.required]],
    contrasena:          ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasena: ['', [Validators.required]],
  }, { validators: contrasenaCoincideValidator });

  cargando = false;
  enviado = false;

async ngOnInit(): Promise<void> {
    const respuesta = await this.usuariosService.obtenerTiposCedula();
    if (respuesta.Exito && Array.isArray(respuesta.Datos)) {
      const activos = respuesta.Datos.filter(t => t.activo);
      this.tiposCedula.set(activos);
      this.opcionesTipoCedula.set(activos.map(t => ({ valor: t.id, etiqueta: t.tipo })));
    }

    this.form.get('idTipoCedula')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(idTipo => this.actualizarValidacionIdentificacion(idTipo));
  }

  private actualizarValidacionIdentificacion(idTipo: number | null): void {
    const control = this.form.get('identificacion')!;
    const tipo = this.tiposCedula().find(t => t.id === idTipo);

    if (tipo?.formato) {
      control.setValidators([Validators.required, Validators.pattern(tipo.formato)]);
      this.mensajeErrorIdentificacion.set(
        this.translate.instant('registro.validacion.identificacionFormato', { tipo: tipo.tipo })
      );
    } else {
      control.setValidators([Validators.required]);
      this.mensajeErrorIdentificacion.set('registro.validacion.identificacionRequerida');
    }

    control.updateValueAndValidity();
  }

  async enviar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid) return;

    this.cargando = true;
    this.form.disable();

    const v = this.form.getRawValue();

    const respuesta = await this.usuariosService.agregar({
      IdTipoCedula:    v.idTipoCedula!,
      Identificacion:  v.identificacion!,
      Nombre:          v.nombre!,
      Apellidos:       v.apellidos!,
      Correo:          v.correo!,
      Telefono:        v.telefono!,
      FechaNacimiento: v.fechaNacimiento!,
      Contrasena:      v.contrasena!,
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje || this.translate.instant('registro.error'),
      });
      return;
    }

    this.popup.mostrar({
      tipo: 'exito',
      titulo: this.translate.instant('exito.titulo'),
      mensaje: this.translate.instant('registro.exito'),
    });

    this.router.navigate(['/inicio-sesion'], { replaceUrl: true });
  }

  irALogin(): void {
    this.router.navigate(['/inicio-sesion']);
  }
}
