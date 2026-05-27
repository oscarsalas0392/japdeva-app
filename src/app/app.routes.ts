import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolInternoGuard } from './core/guards/rol-interno.guard';
import { rolExternoGuard } from './core/guards/rol-externo.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full',
  },

  // ───── Públicas ─────
  {
    path: 'inicio-sesion',
    loadComponent: () => import('./pages/inicio-sesion/inicio-sesion.page').then((m) => m.InicioSesionPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: 'olvido-contrasena',
    loadComponent: () => import('./pages/olvido-contrasena/olvido-contrasena.page').then((m) => m.OlvidoContrasenaPage),
  },
  {
    path: 'terminos-condiciones',
    loadComponent: () => import('./pages/terminos-condiciones/terminos-condiciones.page').then((m) => m.TerminosCondicionesPage),
  },

  // ───── Autenticadas (cualquier rol) ─────
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: 'cambiar-contrasena',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cambiar-contrasena/cambiar-contrasena.page').then((m) => m.CambiarContrasenaPage),
  },
  {
    path: 'editar-perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/editar-perfil/editar-perfil.page').then((m) => m.EditarPerfilPage),
  },
  {
    path: 'informacion',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/informacion/informacion.page').then((m) => m.InformacionPage),
  },

  // ───── Solo rol externo (cliente) ─────
  {
    path: 'inicio',
    canActivate: [authGuard, rolExternoGuard],
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'nuevo-reclamo',
    canActivate: [authGuard, rolExternoGuard],
    loadComponent: () => import('./pages/nuevo-reclamo/nuevo-reclamo.page').then((m) => m.NuevoReclamoPage),
  },
  {
    path: 'detalle-reclamo/:id',
    canActivate: [authGuard, rolExternoGuard],
    loadComponent: () => import('./pages/detalle-reclamo/detalle-reclamo.page').then((m) => m.DetalleReclamoPage),
  },
  {
    path: 'buscar',
    canActivate: [authGuard, rolExternoGuard],
    loadComponent: () => import('./pages/buscar/buscar.page').then((m) => m.BuscarPage),
  },

  // ───── Solo rol interno (empleado) ─────
  {
    path: 'inicio-usuario-interno',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/inicio-usuario-interno/inicio-usuario-interno.page').then((m) => m.InicioUsuarioInternoPage),
  },
  {
    path: 'buscar-usuario-cedula',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/buscar-usuario-cedula/buscar-usuario-cedula.page').then((m) => m.BuscarUsuarioCedulaPage),
  },
  {
    path: 'gestion-usuarios',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/gestion-usuarios/gestion-usuarios.page').then((m) => m.GestionUsuariosPage),
  },
  {
    path: 'atender-reclamo/:id',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/atender-reclamo/atender-reclamo.page').then((m) => m.AtenderReclamoPage),
  },
  {
    path: 'informacion-reclamo/:id',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/informacion-reclamo/informacion-reclamo.page').then((m) => m.InformacionReclamoPage),
  },
  {
    path: 'buscar-reclamos-fecha-estado',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/buscar-reclamos-fecha-estado/buscar-reclamos-fecha-estado.page').then((m) => m.BuscarReclamosFechaEstadoPage),
  },
  {
    path: 'resultados-reclamos',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/resultados-reclamos/resultados-reclamos.page').then((m) => m.ResultadosReclamosPage),
  },
  {
    path: 'buscar-reclamos-id',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/buscar-reclamos-id/buscar-reclamos-id.page').then((m) => m.BuscarReclamosIdPage),
  },
  {
    path: 'informacion-usuario-interno',
    canActivate: [authGuard, rolInternoGuard],
    loadComponent: () => import('./pages/informacion-usuario-interno/informacion-usuario-interno.page').then((m) => m.InformacionUsuarioInternoPage),
  },
];
