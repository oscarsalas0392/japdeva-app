import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { AuthService } from '../../core/services/auth.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PaginaComponent,
    TarjetaComponent,
    GrupoCampoComponent,
    CampoFormularioComponent,
    BotonCargandoComponent,
  ],
})
export class EditarPerfilPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly estadoService = inject(EstadoAppService);
  private readonly popup = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private usuarioId = 0;

  readonly form = this.fb.group({
    nombre:    ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
  });

  cargando = false;
  enviado = false;

  async ngOnInit(): Promise<void> {
    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (u) {
      this.usuarioId = u.id;
      this.form.patchValue({ nombre: u.nombre, apellidos: u.apellidos });
    }
  }

  async enviar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid) return;

    this.cargando = true;
    this.form.disable();

    const { nombre, apellidos } = this.form.getRawValue();

    const respuesta = await this.authService.actualizarPerfil({
      Id: this.usuarioId,
      Nombre: nombre!,
      Apellidos: apellidos!,
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: this.translate.instant('editarPerfil.error'),
      });
      return;
    }

    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (u) {
      await this.estadoService.guardar(ClavesEstado.usuario, {
        ...u,
        nombre: nombre!,
        apellidos: apellidos!,
      });
    }

    this.popup.mostrar({
      tipo: 'exito',
      titulo: this.translate.instant('exito.titulo'),
      mensaje: this.translate.instant('editarPerfil.exito'),
    });

    this.router.navigate(['/perfil'], { replaceUrl: true });
  }
}
