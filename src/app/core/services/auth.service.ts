import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { AuthRequest } from '../models/usuarios/auth-request.model';
import { AutenticarUsuarioRespuestaModel } from '../models/usuarios/auth-response.model';
import { OlvidoContrasenaRequest } from '../models/usuarios/olvido-contrasena-request.model';
import { CambiarContrasenaRequest } from '../models/usuarios/cambiar-contrasena-request.model';
import { ActualizarUsuarioSolicitudModel } from '../models/usuarios/actualizar-usuario-solicitud.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly ep = environment.endpoints.usuarios.auth;

  /**
   * Autentica al usuario con sus credenciales.
   * @param solicitud Correo y contraseña del usuario.
   * @returns Datos del usuario autenticado y token JWT.
   */
  autenticar(solicitud: AuthRequest): Promise<RespuestaModel<AutenticarUsuarioRespuestaModel>> {
    return this.api.post(this.ep.autenticar, solicitud);
  }

  /**
   * Envía un correo para recuperar la contraseña olvidada.
   * @param solicitud Correo electrónico de la cuenta a recuperar.
   */
  olvidarContrasena(solicitud: OlvidoContrasenaRequest): Promise<RespuestaModel<void>> {
    return this.api.post(this.ep.olvidarContrasena, solicitud);
  }

  cambiarContrasena(solicitud: CambiarContrasenaRequest): Promise<RespuestaModel<void>> {
    return this.api.put(environment.endpoints.usuarios.usuario.actualizarContrasena, solicitud);
  }

  actualizarPerfil(solicitud: ActualizarUsuarioSolicitudModel): Promise<RespuestaModel<void>> {
    return this.api.put(environment.endpoints.usuarios.usuario.actualizar, solicitud);
  }
}
