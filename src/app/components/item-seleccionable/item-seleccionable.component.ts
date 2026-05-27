import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef } from '@angular/core';
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
  private readonly cdr         = inject(ChangeDetectorRef);

  presionado   = false;
  sinAnimacion = false;
  private accionSeleccionada = false;

  async alPresionar(): Promise<void> {
    if (!this.opciones.length) return;

    this.presionado         = true;
    this.accionSeleccionada = false;
    this.cdr.markForCheck();

    const botones = [
      ...this.opciones.map(op => ({
        text: this.translate.instant(op.etiqueta),
        role: op.destructivo ? 'destructive' : undefined,
        handler: () => {
          this.accionSeleccionada = true;
          this.accion.emit(op.id);
        },
      })),
      {
        text: this.translate.instant('CANCELAR'),
        role: 'cancel',
      },
    ];

    const sheet = await this.actionSheet.create({
      buttons: botones,
      cssClass: 'accion-sheet',
    });

    await sheet.present();
    await sheet.onDidDismiss();

    if (this.accionSeleccionada) {
      setTimeout(() => {
        this.presionado = false;
        this.cdr.markForCheck();
      }, 50);
    } else {
      this.sinAnimacion = true;
      this.presionado   = false;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.sinAnimacion = false;
        this.cdr.markForCheck();
      }, 50);
    }
  }
}
