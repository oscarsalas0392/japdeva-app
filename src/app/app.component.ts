import { Component, OnInit, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { IonApp, IonRouterOutlet, IonMenu } from '@ionic/angular/standalone';
import { Filesystem } from '@capacitor/filesystem';
import { PopupAvisoComponent } from './components/popup-aviso/popup-aviso.component';
import { MenuUsuarioExternoComponent } from './components/menu-usuario-externo/menu-usuario-externo.component';
import { MenuUsuarioInternoComponent } from './components/menu-usuario-interno/menu-usuario-interno.component';
import { EstadoAppService } from './core/state/app.service';
import { ClavesEstado } from './core/state/claves-estado';

const ROLES_INTERNOS = [1, 2, 3];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet, IonMenu, PopupAvisoComponent, MenuUsuarioExternoComponent, MenuUsuarioInternoComponent],
})
export class AppComponent implements OnInit {
  private readonly router        = inject(Router);
  private readonly estadoService = inject(EstadoAppService);
  private readonly destroyRef    = inject(DestroyRef);

  readonly esInterno = signal(false);

  async ngOnInit(): Promise<void> {
    await this.solicitarPermisos();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.verificarRol());
  }

  private async verificarRol(): Promise<void> {
    const idRol = await this.estadoService.obtener<number>(ClavesEstado.idRol);
    this.esInterno.set(ROLES_INTERNOS.includes(idRol ?? 0));
  }

  private async solicitarPermisos(): Promise<void> {
    try {
      const { publicStorage } = await Filesystem.checkPermissions();
      if (publicStorage !== 'granted') {
        await Filesystem.requestPermissions();
      }
    } catch {
      // En web o iOS los permisos no aplican — ignorar
    }
  }
}
