import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
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
    IonContent, IonCard, IonCardContent,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    GrupoCampoComponent,
    AvisoComponent,
    BotonCargandoComponent,
  ],
})
export class OlvidoContrasenaPage {
  private readonly authService = inject(AuthService);
  private readonly popup = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  cargando = false;
  enviado = false;

  async enviar(): Promise<void> {
    this.enviado = true;

    if (this.form.invalid) {
      return;
    }

    this.cargando = true;
    this.form.disable();

    const respuesta = await this.authService.olvidarContrasena({
      Correo: this.form.getRawValue().correo!,
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje,
      });
      return;
    }

    this.popup.mostrar({
      tipo: 'exito',
      titulo: this.translate.instant('olvidoContrasena.exitoTitulo'),
      mensaje: this.translate.instant('olvidoContrasena.exitoMensaje'),
    });

    this.form.reset();
    this.enviado = false;
  }
}
