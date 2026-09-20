import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { Mensajes } from '../constants/mensajes.constants';
import { EstadoAppService } from '../state/app.service';
import { PopupAvisoService } from '../../components/popup-aviso/popup-aviso.service';
import { AlmacenamientoService } from './almacenamiento.service';
import { ClavesAlmacenamiento } from '../constants/claves-almacenamiento';

type QueryParamValue = string | number | boolean | string[];
type QueryParams = Record<string, QueryParamValue>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly estadoApp = inject(EstadoAppService);
  private readonly popup = inject(PopupAvisoService);
  private readonly almacenamiento = inject(AlmacenamientoService);
  private readonly api = environment.apiUrl;
  private readonly timeoutMs = environment.timeoutMs;

  private readonly rutasPublicas = ['/inicio-sesion', '/registro', '/olvido-contrasena'];

  /** Flag para evitar disparar múltiples expulsiones simultáneas. */
  private expulsando = false;

  /**
   * Realiza una petición GET al API Gateway.
   * @param endpoint Ruta del endpoint definida en environment.endpoints.
   * @param params Parámetros de consulta opcionales como objeto clave-valor.
   * @returns Promesa con la respuesta genérica del API.
   */
  async get<T>(endpoint: string, params?: QueryParams): Promise<RespuestaModel<T>> {
    try {
      const raw = await firstValueFrom(
        this.http.get<any>(`${this.api}${endpoint}`, { params: this.construirParametros(params) }).pipe(timeout(this.timeoutMs))
      );
      const respuesta = this.normalizar<T>(raw);
      await this.guardarToken(respuesta);
      return respuesta;
    } catch (error) {
      return this.respuestaError<T>(error);
    }
  }

  /**
   * Realiza una petición POST al API Gateway.
   * Si la respuesta contiene un Token, lo guarda automáticamente en localStorage.
   * @param endpoint Ruta del endpoint definida en environment.endpoints.
   * @param body Objeto con los datos a enviar en el cuerpo de la petición.
   * @returns Promesa con la respuesta genérica del API.
   */
  async post<T>(endpoint: string, body: unknown): Promise<RespuestaModel<T>> {
    try {
      const raw = await firstValueFrom(
        this.http.post<any>(`${this.api}${endpoint}`, body).pipe(timeout(this.timeoutMs))
      );
      const respuesta = this.normalizar<T>(raw);
      await this.guardarToken(respuesta);
      return respuesta;
    } catch (error) {
      return this.respuestaError<T>(error);
    }
  }

  /**
   * Realiza una petición PUT al API Gateway.
   * @param endpoint Ruta del endpoint definida en environment.endpoints.
   * @param body Objeto con los datos a enviar en el cuerpo de la petición.
   * @returns Promesa con la respuesta genérica del API.
   */
  async put<T>(endpoint: string, body: unknown): Promise<RespuestaModel<T>> {
    try {
      const raw = await firstValueFrom(
        this.http.put<any>(`${this.api}${endpoint}`, body).pipe(timeout(this.timeoutMs))
      );
      const respuesta = this.normalizar<T>(raw);
      await this.guardarToken(respuesta);
      return respuesta;
    } catch (error) {
      return this.respuestaError<T>(error);
    }
  }

  /**
   * Realiza una petición DELETE al API Gateway.
   * @param endpoint Ruta del endpoint definida en environment.endpoints.
   * @param params Parámetros de consulta opcionales como objeto clave-valor.
   * @returns Promesa con la respuesta genérica del API.
   */
  async delete<T>(endpoint: string, params?: QueryParams): Promise<RespuestaModel<T>> {
    try {
      const raw = await firstValueFrom(
        this.http.delete<any>(`${this.api}${endpoint}`, { params: this.construirParametros(params) })
      );
      const respuesta = this.normalizar<T>(raw);
      await this.guardarToken(respuesta);
      return respuesta;
    } catch (error) {
      return this.respuestaError<T>(error);
    }
  }

  /**
   * Obtiene el token JWT almacenado.
   * @returns El token como string, o null si no existe.
   */
  getToken(): Promise<string | null> {
    return this.almacenamiento.obtener(ClavesAlmacenamiento.token);
  }

  /**
   * Elimina el token JWT del almacenamiento.
   * Debe llamarse al cerrar sesión.
   */
  limpiarToken(): Promise<void> {
    return this.almacenamiento.eliminar(ClavesAlmacenamiento.token);
  }

  /**
   * Guarda el Token de la respuesta si está presente.
   * @param respuesta Objeto de respuesta del API.
   */
  private async guardarToken(respuesta: RespuestaModel<unknown>): Promise<void> {
    if (respuesta.Token) {
      await this.almacenamiento.guardar(ClavesAlmacenamiento.token, respuesta.Token);
    }
  }

  private normalizar<T>(raw: any): RespuestaModel<T> {
    const datosRaw = raw.Datos ?? raw.datos;
    let datos: T | undefined;
    if (typeof datosRaw === 'string') {
      try { datos = JSON.parse(datosRaw) as T; } catch { datos = datosRaw as T; }
    } else {
      datos = datosRaw;
    }
    return {
      Exito:         raw.Exito         ?? raw.exito         ?? false,
      Identificador: raw.Identificador ?? raw.identificador ?? '',
      Mensaje:       raw.Mensaje       ?? raw.mensaje       ?? '',
      Datos:         datos,
      Token:         raw.Token         ?? raw.token,
    };
  }

  /**
   * Genera una respuesta de error estándar cuando falla la petición HTTP.
   * @param error Error capturado en el catch.
   * @returns RespuestaModel con Exito en false y mensaje según el tipo de error.
   */
  private respuestaError<T>(error: unknown): RespuestaModel<T> {
    let clave: string;
    let mensajeApi: string | undefined;
    let tituloPopup: string | undefined;
    let expulsa = false;

    if (error instanceof TimeoutError) {
      // El API no contestó a tiempo: tratar como caída del servidor y expulsar.
      clave = Mensajes.errores.timeout;
      tituloPopup = 'errores.titulo';
      expulsa = true;
    } else if (error instanceof HttpErrorResponse && error.status === 0) {
      // status 0 = la request nunca llegó (red caída, CORS, DNS, server unreachable).
      clave = Mensajes.errores.conexion;
      tituloPopup = 'errores.titulo';
      expulsa = true;
    } else if (error instanceof HttpErrorResponse && error.status === 401) {
      void this.limpiarToken();
      mensajeApi = error.error?.mensaje || error.error?.Mensaje;
      clave = Mensajes.errores.noAutorizado;
      tituloPopup = 'errores.sesionVencidaTitulo';
      expulsa = true;
    } else if (error instanceof HttpErrorResponse && error.status >= 500 && error.status < 600) {
      // 5xx: si trae body con formato RespuestaModel (Exito:false + Mensaje) es un
      // error de negocio disfrazado — devolvemos el mensaje sin expulsar. Solo
      // expulsamos cuando el servidor no responde con un cuerpo interpretable.
      const bodyMensaje = error.error?.Mensaje ?? error.error?.mensaje;
      const bodyExito   = error.error?.Exito   ?? error.error?.exito;
      if (bodyMensaje && bodyExito === false) {
        mensajeApi = bodyMensaje;
        clave = Mensajes.errores.servidor;
      } else {
        clave = Mensajes.errores.servidor;
        tituloPopup = 'errores.titulo';
        expulsa = true;
      }
    } else {
      clave = Mensajes.errores.conexion;
    }

    let manejado = false;
    if (expulsa && !this.expulsando && this.estaEnAplicacion()) {
      this.expulsando = true;
      manejado = true;
      this.popup.mostrar({
        tipo: 'error',
        titulo: this.translate.instant(tituloPopup!),
        mensaje: this.translate.instant(clave),
      });
      void this.expulsarSesion();
    } else if (expulsa && this.expulsando) {
      // Otra request en paralelo ya disparó la expulsión — marcamos como manejado
      // para que el caller tampoco muestre su popup.
      manejado = true;
    }

    return {
      Exito: false,
      Identificador: '',
      Mensaje: mensajeApi || this.translate.instant(clave),
      Manejado: manejado,
    };
  }

  /**
   * Verifica si la URL actual corresponde a una pantalla autenticada (dentro de la app).
   */
  private estaEnAplicacion(): boolean {
    const urlActual = this.router.url.split('?')[0];
    return !this.rutasPublicas.some(ruta => urlActual === ruta || urlActual.startsWith(`${ruta}/`));
  }

  /**
   * Limpia la sesión y regresa al inicio de sesión.
   * El flag `expulsando` se baja al terminar para permitir futuras expulsiones
   * después de un login posterior.
   */
  private async expulsarSesion(): Promise<void> {
    try {
      await Promise.all([
        this.limpiarToken(),
        this.estadoApp.limpiar(),
      ]);
      await this.router.navigate(['/inicio-sesion'], { replaceUrl: true });
    } finally {
      this.expulsando = false;
    }
  }

  /**
   * Convierte un objeto clave-valor en un HttpParams de Angular.
   * @param parametros Objeto con los parámetros a convertir.
   * @returns Instancia de HttpParams lista para usar en la petición.
   */
  private construirParametros(parametros?: QueryParams): HttpParams {
    let parametrosHttp = new HttpParams();
    if (parametros) {
      Object.entries(parametros).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => parametrosHttp = parametrosHttp.append(key, v));
        } else {
          parametrosHttp = parametrosHttp.set(key, value);
        }
      });
    }
    return parametrosHttp;
  }
}
