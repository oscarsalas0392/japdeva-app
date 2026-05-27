import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface TabItem {
  id: string;
  etiqueta: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activo = '';
  @Output() tabCambiado = new EventEmitter<string>();
}
