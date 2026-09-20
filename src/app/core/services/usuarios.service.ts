import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { RespuestaListaModel } from '../models/respuesta-lista.model';
import { UsuarioRespuestaModel } from '../models/usuarios/usuario.model';
import { AgregarUsuarioSolicitudModel } from '../models/usuarios/agregar-usuario-solicitud.model';
import { ActualizarUsuarioSolicitudModel } from '../models/usuarios/actualizar-usuario-solicitud.model';
import { ActualizarContrasenaRequest } from '../models/usuarios/actualizar-contrasena-request.model';
import { RolRespuestaModel } from '../models/usuarios/rol.model';
import { TipoCedulaRespuestaModel } from '../models/usuarios/tipo-cedula.model';
import { DepartamentoRespuestaModel } from '../models/usuarios/departamento.model';
import { UsuarioRolRespuestaModel } from '../models/usuarios/usuario-rol.model';
import { AgregarUsuarioRolRequest } from '../models/usuarios/agregar-usuario-rol-request.model';
import { ActualizarUsuarioRolSolicitudModel } from '../models/usuarios/actualizar-usuario-rol-solicitud.model';
import { DepartamentoUsuarioRespuestaModel } from '../models/usuarios/departamento-usuario.model';
import { AgregarDepartamentoUsuarioSolicitudModel } from '../models/usuarios/agregar-departamento-usuario-solicitud.model';
import { OpcionSelectModel } from '../models/opcion-select.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly api = inject(ApiService);
  private readonly epUsuario = environment.endpoints.usuarios.usuario;
  private readonly epRol = environment.endpoints.usuarios.rol;
  private readonly epTipoCedula = environment.endpoints.usuarios.tipoCedula;
  private readonly epDepartamento = environment.endpoints.usuarios.departamento;
  private readonly epUsuarioRol = environment.endpoints.usuarios.usuarioRol;
  private readonly epDepartamentoUsuario = environment.endpoints.usuarios.departamentoUsuario;

  // ── Usuario ──────────────────────────────────────────────────────────────

  /**
   * Obtiene todos los usuarios del sistema.
   */
  obtenerTodos(): Promise<RespuestaModel<RespuestaListaModel<UsuarioRespuestaModel>>> {
    return this.api.get(this.epUsuario.obtenerTodos);
  }

  /**
   * Obtiene un usuario por su identificador.
   * @param id Identificador del usuario.
   */
  obtenerPorId(id: number): Promise<RespuestaModel<UsuarioRespuestaModel>> {
    return this.api.get(this.epUsuario.obtenerPorId, { id });
  }

  obtenerPorIdentificacion(identificacion: string): Promise<RespuestaModel<UsuarioRespuestaModel>> {
    return this.api.get(this.epUsuario.obtenerPorIdentificacion, { identificacion });
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param solicitud Datos del nuevo usuario.
   */
  agregar(solicitud: AgregarUsuarioSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.post(this.epUsuario.agregar, solicitud);
  }

  /**
   * Actualiza los datos de un usuario existente.
   * @param solicitud Datos actualizados del usuario.
   */
  actualizar(solicitud: ActualizarUsuarioSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.put(this.epUsuario.actualizar, solicitud);
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param solicitud Contraseña anterior y nueva.
   */
  actualizarContrasena(solicitud: ActualizarContrasenaRequest): Promise<RespuestaModel<void>> {
    return this.api.put(this.epUsuario.actualizarContrasena, solicitud);
  }

  /**
   * Elimina un usuario por su identificador.
   * @param id Identificador del usuario.
   */
  eliminar(id: number): Promise<RespuestaModel<void>> {
    return this.api.delete(this.epUsuario.eliminar, { id });
  }

  // ── Rol ──────────────────────────────────────────────────────────────────

  /**
   * Obtiene todos los roles disponibles.
   */
  obtenerRoles(): Promise<RespuestaModel<RolRespuestaModel[]>> {
    return this.api.get(this.epRol.obtenerTodos);
  }

  /** Obtiene los roles activos transformados al modelo de OpcionSelect, listos para un dropdown. */
  async obtenerRolesActivosComoOpciones(): Promise<OpcionSelectModel[]> {
    const respuesta = await this.obtenerRoles();
    if (!respuesta.Exito || !Array.isArray(respuesta.Datos)) return [];
    return respuesta.Datos
      .filter(r => r.activo)
      .map(r => ({ valor: r.id, etiqueta: r.descripcion }));
  }

  /**
   * Obtiene un rol por su identificador.
   * @param id Identificador del rol.
   */
  obtenerRolPorId(id: number): Promise<RespuestaModel<RolRespuestaModel>> {
    return this.api.get(this.epRol.obtenerPorId, { id });
  }

  // ── Tipo Cédula ───────────────────────────────────────────────────────────

  /**
   * Obtiene todos los tipos de cédula disponibles.
   */
  obtenerTiposCedula(): Promise<RespuestaModel<TipoCedulaRespuestaModel[]>> {
    return this.api.get(this.epTipoCedula.obtenerTodos);
  }

  /**
   * Obtiene un tipo de cédula por su identificador.
   * @param id Identificador del tipo de cédula.
   */
  obtenerTipoCedulaPorId(id: number): Promise<RespuestaModel<TipoCedulaRespuestaModel>> {
    return this.api.get(this.epTipoCedula.obtenerPorId, { id });
  }

  // ── Departamento ──────────────────────────────────────────────────────────

  /**
   * Obtiene todos los departamentos disponibles.
   */
  obtenerDepartamentos(): Promise<RespuestaModel<DepartamentoRespuestaModel[]>> {
    return this.api.get(this.epDepartamento.obtenerTodos);
  }

  /** Obtiene los departamentos activos transformados al modelo de OpcionSelect, listos para un dropdown. */
  async obtenerDepartamentosActivosComoOpciones(): Promise<OpcionSelectModel[]> {
    const respuesta = await this.obtenerDepartamentos();
    if (!respuesta.Exito || !Array.isArray(respuesta.Datos)) return [];
    return respuesta.Datos
      .filter(d => d.activo)
      .map(d => ({ valor: d.id, etiqueta: d.descripcion }));
  }

  /**
   * Obtiene un departamento por su identificador.
   * @param id Identificador del departamento.
   */
  obtenerDepartamentoPorId(id: number): Promise<RespuestaModel<DepartamentoRespuestaModel>> {
    return this.api.get(this.epDepartamento.obtenerPorId, { id });
  }

  // ── Usuario Rol ───────────────────────────────────────────────────────────

  /**
   * Obtiene los roles asignados a un usuario.
   * @param idUsuario Identificador del usuario.
   */
  obtenerRolPorUsuario(idUsuario: number): Promise<RespuestaModel<UsuarioRolRespuestaModel>> {
    return this.api.get(this.epUsuarioRol.obtenerPorUsuario, { 'id-usuario': idUsuario });
  }

  /**
   * Asigna un rol a un usuario.
   * @param solicitud Datos de la asignación.
   */
  agregarRolUsuario(solicitud: AgregarUsuarioRolRequest): Promise<RespuestaModel<void>> {
    return this.api.post(this.epUsuarioRol.actualizar, solicitud);
  }

  /**
   * Actualiza el rol asignado a un usuario.
   * @param solicitud Datos actualizados de la asignación.
   */
  actualizarRolUsuario(solicitud: ActualizarUsuarioRolSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.put(this.epUsuarioRol.actualizar, solicitud);
  }

  /**
   * Elimina la asignación de un rol a un usuario.
   * @param id Identificador del registro de asignación.
   */
  eliminarRolUsuario(id: number): Promise<RespuestaModel<void>> {
    return this.api.delete(this.epUsuarioRol.eliminar, { id });
  }

  // ── Departamento Usuario ──────────────────────────────────────────────────

  /**
   * Asigna un usuario a un departamento.
   * @param solicitud Datos de la asignación.
   */
  agregarDepartamentoUsuario(solicitud: AgregarDepartamentoUsuarioSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.post(this.epDepartamentoUsuario.agregar, solicitud);
  }

  /**
   * Obtiene los departamentos asignados a un usuario.
   * @param idUsuario Identificador del usuario.
   */
  obtenerDepartamentoPorUsuario(idUsuario: number): Promise<RespuestaModel<DepartamentoUsuarioRespuestaModel>> {
    return this.api.get(this.epDepartamentoUsuario.obtenerPorUsuario, { 'id-usuario': idUsuario });
  }

  /**
   * Elimina la asignación de un usuario a un departamento.
   * @param id Identificador del registro de asignación.
   */
  eliminarDepartamentoUsuario(id: number): Promise<RespuestaModel<void>> {
    return this.api.delete(this.epDepartamentoUsuario.eliminar, { id });
  }

  /**
   * Reemplaza el departamento asignado a un usuario: si tenía uno previo lo elimina,
   * y luego agrega la nueva asignación. Devuelve `true` si la asignación final tuvo éxito.
   * @param idUsuario Usuario a actualizar.
   * @param idDepartamento Nuevo departamento.
   * @param idUsuarioAdministrador Usuario interno que está realizando el cambio.
   * @param idAsignacionActual Id del registro previo (si existe) a eliminar antes de crear el nuevo.
   */
  async reemplazarDepartamentoUsuario(
    idUsuario: number,
    idDepartamento: number,
    idUsuarioAdministrador: number,
    idAsignacionActual?: number,
  ): Promise<boolean> {
    try 
    {
        let eliminar:boolean= true;
        if (idAsignacionActual)
        {
          const respuestaEliminar = await this.eliminarDepartamentoUsuario(idAsignacionActual);
          eliminar = respuestaEliminar.Exito;
        }

        if(eliminar)
        {
             const respuestaAgregar = await this.agregarDepartamentoUsuario({
                  IdUsuario:              idUsuario,
                  IdDepartamento:         idDepartamento,
                  IdUsuarioAdministrador: idUsuarioAdministrador,
              });

            return respuestaAgregar.Exito;
        }
        
        return false;
    } catch {
      return false;
    }
  }
}
