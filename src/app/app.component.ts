import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu } from '@ionic/angular/standalone';
import { Filesystem } from '@capacitor/filesystem';
import { PopupAvisoComponent } from './components/popup-aviso/popup-aviso.component';
import { MenuUsuarioExternoComponent } from './components/menu-usuario-externo/menu-usuario-externo.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonMenu, PopupAvisoComponent, MenuUsuarioExternoComponent],
})
export class AppComponent implements OnInit {

  async ngOnInit(): Promise<void> {
    await this.solicitarPermisos();
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
