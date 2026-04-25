import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { LogoJapdevaComponent } from '../../components/logo-japdeva/logo-japdeva.component';
import { DecoracionLoginComponent } from '../../components/decoracion-login/decoracion-login.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { EnlacesLoginComponent } from '../../components/enlaces-login/enlaces-login.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { CheckComponent } from '../../components/check/check.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { AuthService } from '../../core/services/auth.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';

const CLAVE_CORREO = 'correo_recordado';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IonContent, IonCard, IonCardContent,
    LogoJapdevaComponent,
    DecoracionLoginComponent,
    CampoFormularioComponent,
    GrupoCampoComponent,
    EnlacesLoginComponent,
    BotonCargandoComponent,
    CheckComponent,
  ],
})
export class InicioSesionPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly estadoService = inject(EstadoAppService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly popup = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);

  readonly form = this.fb.group({
    usuario:    ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  cargando = false;
  enviado = false;
  recordar = false;

  ngOnInit(): void {
    const correoGuardado = localStorage.getItem(CLAVE_CORREO);
    if (correoGuardado) {
      this.form.patchValue({ usuario: correoGuardado });
      this.recordar = true;
    }
  }

  async enviar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid) return;

    this.cargando = true;
    this.form.disable();

    const { usuario, contrasena } = this.form.getRawValue();

    if (this.recordar) {
      localStorage.setItem(CLAVE_CORREO, usuario!);
    } else {
      localStorage.removeItem(CLAVE_CORREO);
    }

    const respuesta = await this.authService.autenticar({
      Correo: usuario!,
      Contrasena: contrasena!,
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje || this.translate.instant('errores.credencialesInvalidas'),
      });
      return;
    }

    await this.estadoService.guardar(ClavesEstado.usuario, respuesta.Datos);
    await this.router.navigate(['/inicio'], { replaceUrl: true });
  }
}
