import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderAppComponent } from '../header-app/header-app.component';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { OverlayCargandoComponent } from '../overlay-cargando/overlay-cargando.component';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderAppComponent, FooterNavComponent, OverlayCargandoComponent],
})
export class PaginaComponent {
  @Input() titulo = '';
  @Input() saludo = '';
  @Input() atras = false;
  @Input() scrollY = true;
  @Input() cargando = false;
  @Input() buscar = false;
  @Output() terminoBusqueda = new EventEmitter<string>();
}
