import { Component, Input, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { helpCircleOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons';

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

interface FaqItemInterno extends FaqItem {
  abierto: boolean;
}

@Component({
  selector: 'app-lista-faqs',
  templateUrl: './lista-faqs.component.html',
  styleUrls: ['./lista-faqs.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ListaFaqsComponent {
  readonly items = signal<FaqItemInterno[]>([]);

  @Input() set faqs(valor: FaqItem[]) {
    this.items.set(valor.map(f => ({ ...f, abierto: false })));
  }

  constructor() {
    addIcons({ helpCircleOutline, chevronUpOutline, chevronDownOutline });
  }

  toggle(index: number): void {
    this.items.update(lista =>
      lista.map((f, i) => ({ ...f, abierto: i === index ? !f.abierto : false }))
    );
  }
}
