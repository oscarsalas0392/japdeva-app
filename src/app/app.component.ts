import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PopupAvisoComponent } from './components/popup-aviso/popup-aviso.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, PopupAvisoComponent],
})
export class AppComponent {}
