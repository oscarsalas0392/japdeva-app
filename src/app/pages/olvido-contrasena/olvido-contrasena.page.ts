import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent, IonText, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, mailOutline } from 'ionicons/icons';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-olvido-contrasena',
  templateUrl: './olvido-contrasena.page.html',
  styleUrls: ['./olvido-contrasena.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    IonContent, IonCard, IonCardContent, IonText, IonButton, IonIcon,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    GrupoCampoComponent,
    BotonCargandoComponent,
  ],
})
export class OlvidoContrasenaPage {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  cargando = false;
  mensajeError = '';
  enviado = false;
  exitoso = false;

  constructor() {
    addIcons({ arrowBackOutline, mailOutline });
  }

  async enviar(): Promise<void> {
    this.enviado = true;

    if (this.form.invalid) {
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { correo } = this.form.getRawValue();

    const respuesta = await this.authService.olvidarContrasena({ Correo: correo! });

    this.cargando = false;

    if (!respuesta.Exito) {
      this.mensajeError = respuesta.Mensaje;
      return;
    }

    this.exitoso = true;
  }
}
