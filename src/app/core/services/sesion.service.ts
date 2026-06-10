import { inject, Injectable } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { ParametrosService } from './parametros.service';
import { MenusService } from './menus.service';
import { EstadoAppService } from '../state/app.service';
import { ClavesEstado } from '../state/claves-estado';
import { AutenticarUsuarioRespuestaModel } from '../models/usuarios/auth-response.model';

/**
 * Servicio que orquesta el flujo de inicialización de sesión post-login.
 * Carga rol + departamento + menús + descripciones cacheables en paralelo
 * y los persiste en el estado global. Si alguna carga falla, no bloquea el login.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly usuariosService  = inject(UsuariosService);
  private readonly parametrosService = inject(ParametrosService);
  private readonly menusService     = inject(MenusService);
  private readonly estadoService    = inject(EstadoAppService);

  /** Devuelve el modelo completo del usuario autenticado, o null si no hay sesión. */
  obtenerUsuario(): Promise<AutenticarUsuarioRespuestaModel | null> {
    return this.estadoService.obtener<AutenticarUsuarioRespuestaModel>(ClavesEstado.usuario);
  }

  /** Devuelve el id del usuario autenticado, o 0 si no hay sesión. */
  async obtenerIdUsuario(): Promise<number> {
    const usuario = await this.obtenerUsuario();
    return usuario?.id ?? 0;
  }

  /**
   * Carga y persiste todos los datos de sesión asociados a un usuario.
   * @param idUsuario Identificador del usuario recién autenticado.
   * @returns El idRol del usuario para que el caller pueda decidir la ruta de navegación.
   */
  async inicializarSesion(idUsuario: number): Promise<number | null> {
    try {
      const [rolRespuesta, departamentoRespuesta] = await Promise.all([
        this.usuariosService.obtenerRolPorUsuario(idUsuario),
        this.usuariosService.obtenerDepartamentoPorUsuario(idUsuario),
      ]);

      const usuarioRol  = rolRespuesta.Exito && rolRespuesta.Datos ? rolRespuesta.Datos : null;
      const idRol       = usuarioRol?.idRol ?? null;
      const deptUsuario = departamentoRespuesta.Exito && departamentoRespuesta.Datos
        ? departamentoRespuesta.Datos : null;

      await Promise.all([
        this.estadoService.guardar(ClavesEstado.usuarioRol, usuarioRol),
        this.estadoService.guardar(ClavesEstado.idRol, idRol),
        deptUsuario ? this.estadoService.guardar(ClavesEstado.departamentoUsuario, deptUsuario) : Promise.resolve(),
      ]);

      const tareas: Promise<void>[] = [];
      if (idRol) {
        tareas.push(this.cachearDescripcionRol(idRol));
        tareas.push(this.cargarMenus(idRol));
      }
      if (deptUsuario?.idDepartamento) {
        tareas.push(this.cachearDescripcionDepartamento(deptUsuario.idDepartamento));
      }
      await Promise.all(tareas);

      return idRol;
    } catch {
      // Si falla, no bloquear el login
      return null;
    }
  }

  private async cachearDescripcionRol(idRol: number): Promise<void> {
    try {
      const respuesta = await this.usuariosService.obtenerRolPorId(idRol);
      if (respuesta.Exito && respuesta.Datos) {
        await this.estadoService.guardar(ClavesEstado.rolDescripcion, respuesta.Datos.descripcion);
      }
    } catch { /* no bloquear */ }
  }

  private async cachearDescripcionDepartamento(idDepartamento: number): Promise<void> {
    try {
      const respuesta = await this.usuariosService.obtenerDepartamentoPorId(idDepartamento);
      if (respuesta.Exito && respuesta.Datos) {
        await this.estadoService.guardar(ClavesEstado.departamentoDescripcion, respuesta.Datos.descripcion);
      }
    } catch { /* no bloquear */ }
  }

  private async cargarMenus(idRol: number): Promise<void> {
    try {
      const respuesta = await this.parametrosService.obtenerMenusPorPerfil(idRol);
      if (respuesta.Exito && respuesta.Datos) {
        this.menusService.establecer(respuesta.Datos);
      }
    } catch {
      // Si falla, el menú queda vacío pero no bloquea el login
    }
  }
}
