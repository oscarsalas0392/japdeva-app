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
];
