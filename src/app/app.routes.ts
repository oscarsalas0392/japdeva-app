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
];
