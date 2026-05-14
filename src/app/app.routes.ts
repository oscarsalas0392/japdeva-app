import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full',
  },
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
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./pages/cambiar-contrasena/cambiar-contrasena.page').then((m) => m.CambiarContrasenaPage),
  },
  {
    path: 'editar-perfil',
    loadComponent: () => import('./pages/editar-perfil/editar-perfil.page').then((m) => m.EditarPerfilPage),
  },
  {
    path: 'nuevo-reclamo',
    loadComponent: () => import('./pages/nuevo-reclamo/nuevo-reclamo.page').then((m) => m.NuevoReclamoPage),
  },
  {
    path: 'detalle-reclamo/:id',
    loadComponent: () => import('./pages/detalle-reclamo/detalle-reclamo.page').then((m) => m.DetalleReclamoPage),
  },
  {
    path: 'buscar',
    loadComponent: () => import('./pages/buscar/buscar.page').then((m) => m.BuscarPage),
  },
  {
    path: 'terminos-condiciones',
    loadComponent: () => import('./pages/terminos-condiciones/terminos-condiciones.page').then((m) => m.TerminosCondicionesPage),
  },
  {
    path: 'informacion',
    loadComponent: () => import('./pages/informacion/informacion.page').then((m) => m.InformacionPage),
  },
  {
    path: 'buscar-usuario-cedula',
    loadComponent: () => import('./pages/buscar-usuario-cedula/buscar-usuario-cedula.page').then((m) => m.BuscarUsuarioCedulaPage),
  },
  {
    path: 'gestion-usuarios',
    loadComponent: () => import('./pages/gestion-usuarios/gestion-usuarios.page').then((m) => m.GestionUsuariosPage),
  },
  {
    path: 'atender-reclamo/:id',
    loadComponent: () => import('./pages/atender-reclamo/atender-reclamo.page').then((m) => m.AtenderReclamoPage),
  },
  {
    path: 'inicio-usuario-interno',
    loadComponent: () => import('./pages/inicio-usuario-interno/inicio-usuario-interno.page').then((m) => m.InicioUsuarioInternoPage),
  },
];
