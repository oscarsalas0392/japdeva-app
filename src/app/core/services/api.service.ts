import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { RespuestaModel } from '../models/respuesta.model';
import { Mensajes } from '../constants/mensajes.constants';

type QueryParams = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly api = environment.apiUrl;
  private readonly timeoutMs = environment.timeoutMs;

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
      this.guardarToken(respuesta);
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
      this.guardarToken(respuesta);
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
      this.guardarToken(respuesta);
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
      this.guardarToken(respuesta);
      return respuesta;
    } catch (error) {
      return this.respuestaError<T>(error);
    }
  }

  /**
   * Obtiene el token JWT almacenado en localStorage.
   * @returns El token como string, o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Elimina el token JWT del localStorage.
   * Debe llamarse al cerrar sesión.
   */
  limpiarToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Guarda el Token de la respuesta en localStorage si está presente.
   * @param respuesta Objeto de respuesta del API.
   */
  private guardarToken(respuesta: RespuestaModel<unknown>): void {
    if (respuesta.Token) {
      localStorage.setItem('token', respuesta.Token);
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

    if (error instanceof TimeoutError) {
      clave = Mensajes.errores.timeout;
    } else if (error instanceof HttpErrorResponse && error.status === 401) {
      this.limpiarToken();
      const mensajeApi = error.error?.mensaje || error.error?.Mensaje;
      if (mensajeApi) {
        return { Exito: false, Identificador: '', Mensaje: mensajeApi };
      }
      clave = Mensajes.errores.noAutorizado;
    } else {
      clave = Mensajes.errores.conexion;
    }

    return { Exito: false, Identificador: '', Mensaje: this.translate.instant(clave) };
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
        parametrosHttp = parametrosHttp.set(key, value);
      });
    }
    return parametrosHttp;
  }
}
