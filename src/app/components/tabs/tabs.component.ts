import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TabItem {
  id: string;
  etiqueta: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activo = '';
  @Output() tabCambiado = new EventEmitter<string>();
}
