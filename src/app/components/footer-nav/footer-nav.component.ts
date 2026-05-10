import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { IonIcon, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, menuOutline, documentTextOutline, searchOutline } from 'ionicons/icons';
import { EstadoAppService } from '../../core/state/app.service';
import { ClavesEstado } from '../../core/state/claves-estado';

const ROLES_INTERNOS = [1, 2, 3];

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonIcon],
})
export class FooterNavComponent implements OnInit {
  private readonly menuCtrl    = inject(MenuController);
  private readonly estadoService = inject(EstadoAppService);
  private readonly router      = inject(Router);

  readonly rutaInicio = signal('/inicio');

  constructor() {
    addIcons({ homeOutline, personOutline, menuOutline, documentTextOutline, searchOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.actualizarRuta();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.actualizarRuta());
  }

  private async actualizarRuta(): Promise<void> {
    const idRol = await this.estadoService.obtener<number>(ClavesEstado.idRol);
    this.rutaInicio.set(ROLES_INTERNOS.includes(idRol ?? 0)
      ? '/inicio-usuario-interno'
      : '/inicio'
    );
  }

  async abrirMenu(): Promise<void> {
    await this.menuCtrl.open();
  }
}
