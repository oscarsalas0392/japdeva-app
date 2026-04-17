import { Injectable } from '@angular/core';
import { State, Action, StateContext, createSelector } from '@ngxs/store';
import { ClaveEstado } from './claves-estado';

// ──────────────────────────────────────────────
// Acciones
// ──────────────────────────────────────────────

export class EstablecerDato {
  static readonly type = '[Estado] Establecer Dato';
  constructor(public clave: ClaveEstado, public valor: unknown) {}
}

export class EliminarDato {
  static readonly type = '[Estado] Eliminar Dato';
  constructor(public clave: ClaveEstado) {}
}

export class LimpiarEstado {
  static readonly type = '[Estado] Limpiar Estado';
}

// ──────────────────────────────────────────────
// Estado
// ──────────────────────────────────────────────

export type ModeloEstadoApp = Record<ClaveEstado, unknown>;

@State<ModeloEstadoApp>({
  name: 'app',
  defaults: {} as ModeloEstadoApp,
})
@Injectable()
export class EstadoApp {

  /**
   * Selector dinámico que retorna el valor asociado a una clave del estado.
   * @param clave Clave del dato a seleccionar.
   */
  static seleccionar<T>(clave: ClaveEstado) {
    return createSelector([EstadoApp], (estado: ModeloEstadoApp): T | null =>
      (estado[clave] as T) ?? null
    );
  }

  /** Guarda o actualiza un valor en el estado. */
  @Action(EstablecerDato)
  establecerDato(ctx: StateContext<ModeloEstadoApp>, accion: EstablecerDato): void {
    ctx.patchState({ [accion.clave]: accion.valor });
  }

  /** Elimina un valor del estado por su clave. */
  @Action(EliminarDato)
  eliminarDato(ctx: StateContext<ModeloEstadoApp>, accion: EliminarDato): void {
    const estado = { ...ctx.getState() };
    delete estado[accion.clave];
    ctx.setState(estado);
  }

  /** Limpia todo el estado de la aplicación. */
  @Action(LimpiarEstado)
  limpiarEstado(ctx: StateContext<ModeloEstadoApp>): void {
    ctx.setState({} as ModeloEstadoApp);
  }
}
