import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent, IonText } from '@ionic/angular/standalone';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { EnlacesLoginComponent } from '../../components/enlaces-login/enlaces-login.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { AuthService } from '../../core/services/auth.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IonContent, IonCard, IonCardContent, IonText,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    GrupoCampoComponent,
    EnlacesLoginComponent,
    BotonCargandoComponent,
  ],
})
export class InicioSesionPage {
  private readonly authService = inject(AuthService);
  private readonly estadoService = inject(EstadoAppService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    usuario:    ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  cargando = false;
  mensajeError = '';
  enviado = false;

  async enviar(): Promise<void> {
    this.enviado = true;

    if (this.form.invalid) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { usuario, contrasena } = this.form.getRawValue();
    const respuesta = await this.authService.autenticar({
      Correo: usuario!,
      Contrasena: contrasena!,
    });

    this.cargando = false;

    if (!respuesta.Exito) {
      this.mensajeError = respuesta.Mensaje;
      return;
    }

    await this.estadoService.guardar(ClavesEstado.usuario, respuesta.Datos);
    await this.router.navigate(['/tabs'], { replaceUrl: true });
  }
}
