import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-seccion-header',
  templateUrl: './seccion-header.component.html',
  styleUrls: ['./seccion-header.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonIcon],
})
export class SeccionHeaderComponent {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() icono = '';

  constructor() {
    addIcons({ documentTextOutline });
  }
}
