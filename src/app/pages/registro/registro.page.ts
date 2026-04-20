import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { CampoSelectComponent, OpcionSelect } from '../../components/campo-select/campo-select.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { UsuariosService } from '../../core/services/usuarios.service';

function contrasenaIgualValidator(group: AbstractControl): ValidationErrors | null {
  const contrasena = group.get('contrasena')?.value;
  const confirmar = group.get('confirmarContrasena')?.value;
  return contrasena === confirmar ? null : { contrasenasDiferentes: true };
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    IonContent, IonCard, IonCardContent, IonText, IonButton, IonIcon,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    CampoSelectComponent,
    GrupoCampoComponent,
    BotonCargandoComponent,
  ],
})
export class RegistroPage implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    idTipoCedula:        [null as number | null, [Validators.required]],
    identificacion:      ['', [Validators.required]],
    nombre:              ['', [Validators.required]],
    apellidos:           ['', [Validators.required]],
    correo:              ['', [Validators.required, Validators.email]],
    contrasena:          ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasena: ['', [Validators.required]],
  }, { validators: contrasenaIgualValidator });

  tiposCedula: OpcionSelect[] = [];
  cargando = false;
  mensajeError = '';
  enviado = false;

  constructor() {
    addIcons({ arrowBackOutline });
  }

  private readonly opcionesPredeterminadas: OpcionSelect[] = [
    { valor: 1, etiqueta: 'Cédula Nacional' },
    { valor: 2, etiqueta: 'DIMEX' },
    { valor: 3, etiqueta: 'Pasaporte' },
  ];

  async ngOnInit(): Promise<void> {
    const respuesta = await this.usuariosService.obtenerTiposCedula();
    if (respuesta.Exito && respuesta.Datos?.Lista?.length) {
      this.tiposCedula = respuesta.Datos.Lista
        .filter(t => t.Activo)
        .map(t => ({ valor: t.Id, etiqueta: t.Tipo }));
    } else {
      this.tiposCedula = this.opcionesPredeterminadas;
    }
  }

  get mismatchContrasena(): boolean {
    return (
      this.enviado &&
      this.form.hasError('contrasenasDiferentes') &&
      (this.form.get('confirmarContrasena')?.valid ?? false)
    );
  }

  async enviar(): Promise<void> {
    this.enviado = true;

    if (this.form.invalid) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { idTipoCedula, identificacion, nombre, apellidos, correo, contrasena } = this.form.getRawValue();

    const respuesta = await this.usuariosService.agregar({
      IdTipoCedula: idTipoCedula!,
      Identificacion: identificacion!,
      Nombre: nombre!,
      Apellidos: apellidos!,
      Correo: correo!,
      Contrasena: contrasena!,
    });

    this.cargando = false;

    if (!respuesta.Exito) {
      this.mensajeError = respuesta.Mensaje;
      return;
    }

    await this.router.navigate(['/inicio-sesion'], { replaceUrl: true });
  }
}
