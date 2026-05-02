import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { attachOutline, closeCircleOutline, documentOutline } from 'ionicons/icons';
import { PaginaComponent } from '../../components/pagina/pagina.component';
import { SeccionHeaderComponent } from '../../components/seccion-header/seccion-header.component';
import { TarjetaComponent } from '../../components/tarjeta/tarjeta.component';
import { GrupoCampoComponent } from '../../components/grupo-campo/grupo-campo.component';
import { CampoFormularioComponent } from '../../components/campo-formulario/campo-formulario.component';
import { CampoTextareaComponent } from '../../components/campo-textarea/campo-textarea.component';
import { AdjuntarArchivoComponent } from '../../components/adjuntar-archivo/adjuntar-archivo.component';
import { BotonCargandoComponent } from '../../components/boton-cargando/boton-cargando.component';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { ReclamoService } from '../../core/services/reclamo.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../../core/models/usuarios/auth-response.model';
import { ArchivoSolicitudModel } from '../../core/models/reclamos/documento.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-reclamo',
  templateUrl: './nuevo-reclamo.page.html',
  styleUrls: ['./nuevo-reclamo.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IonIcon,
    PaginaComponent,
    SeccionHeaderComponent,
    TarjetaComponent,
    GrupoCampoComponent,
    CampoFormularioComponent,
    CampoTextareaComponent,
    AdjuntarArchivoComponent,
    BotonCargandoComponent,
  ],
})
export class NuevoReclamoPage implements OnInit {
  private readonly reclamoService = inject(ReclamoService);
  private readonly estadoService  = inject(EstadoAppService);
  private readonly popup          = inject(PopupAvisoService);
  private readonly translate      = inject(TranslateService);
  private readonly router         = inject(Router);
  private readonly fb             = inject(FormBuilder);

  private usuarioId = 0;

  readonly form = this.fb.group({
    titulo:      ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  archivo: ArchivoSolicitudModel | null = null;
  cargando = false;
  enviado  = false;

  constructor() {
    addIcons({ attachOutline, closeCircleOutline, documentOutline });
  }

  async ngOnInit(): Promise<void> {
    const u = await this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
    if (u) this.usuarioId = u.id;
  }

  async enviar(): Promise<void> {
    this.enviado = true;
    if (this.form.invalid || !this.archivo) return;

    this.cargando = true;
    this.form.disable();

    const { titulo, descripcion } = this.form.getRawValue();

    const respuesta = await this.reclamoService.agregar({
      Id:               0,
      Titulo:           titulo!,
      Descripcion:      descripcion!,
      IdUsuarioExterno: this.usuarioId,
      ListaDocumentos:  this.archivo ? [this.archivo] : [],
    });

    this.cargando = false;
    this.form.enable();

    if (!respuesta.Exito) {
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant('errores.titulo'),
        mensaje: respuesta.Mensaje || this.translate.instant('nuevoReclamo.error'),
      });
      return;
    }

    this.popup.mostrar({
      tipo: 'exito',
      titulo: this.translate.instant('exito.titulo'),
      mensaje: this.translate.instant('nuevoReclamo.exito'),
    });

    this.router.navigate(['/inicio'], { replaceUrl: true });
  }
}
