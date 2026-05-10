import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, arrowBackOutline, searchOutline } from 'ionicons/icons';
import { TranslateService } from '@ngx-translate/core';
import { PopupAvisoService } from '../popup-aviso/popup-aviso.service';
import { EstadoAppService } from '../../core/state/app.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-header-app',
  templateUrl: './header-app.component.html',
  styleUrls: ['./header-app.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class HeaderAppComponent {
  @Input() saludo = '';
  @Input() titulo = '';
  @Input() atras = false;
  @Input() buscar = false;
  @Output() terminoBusqueda = new EventEmitter<string>();

  private readonly popup = inject(PopupAvisoService);
  private readonly translate = inject(TranslateService);
  private readonly estadoService = inject(EstadoAppService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  constructor() {
    addIcons({ logOutOutline, arrowBackOutline, searchOutline });
  }

  navegarAtras(): void {
    this.location.back();
  }

  async cerrarSesion(): Promise<void> {
    const confirmado = await this.popup.confirmar({
      tipo: 'info',
      titulo: this.translate.instant('cerrarSesion.confirmaTitulo'),
      mensaje: this.translate.instant('cerrarSesion.confirmaMsg'),
    });

    if (!confirmado) return;

    await this.estadoService.limpiar();
    this.apiService.limpiarToken();
    await this.router.navigate(['/inicio-sesion'], { replaceUrl: true });
  }
}
