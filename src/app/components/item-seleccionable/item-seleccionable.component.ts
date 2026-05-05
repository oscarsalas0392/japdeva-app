import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController } from '@ionic/angular/standalone';
import { OpcionAccionModel } from '../../core/models/opcion-accion.model';

@Component({
  selector: 'app-item-seleccionable',
  templateUrl: './item-seleccionable.component.html',
  styleUrls: ['./item-seleccionable.component.scss'],
  standalone: true,
  imports: [],
})
export class ItemSeleccionableComponent {
  @Input() opciones: OpcionAccionModel[] = [];
  @Output() accion = new EventEmitter<string>();

  private readonly actionSheet = inject(ActionSheetController);
  private readonly translate   = inject(TranslateService);

  presionado = false;

  async alPresionar(): Promise<void> {
    if (!this.opciones.length) return;

    this.presionado = true;
    setTimeout(() => this.presionado = false, 150);

    const botones = [
      ...this.opciones.map(op => ({
        text: this.translate.instant(op.etiqueta),
        role: op.destructivo ? 'destructive' : undefined,
        handler: () => this.accion.emit(op.id),
      })),
      {
        text:    this.translate.instant('CANCELAR'),
        role:    'cancel',
        handler: () => {},
      },
    ];

    const sheet = await this.actionSheet.create({
      buttons: botones,
      cssClass: 'accion-sheet',
    });

    await sheet.present();
  }
}
