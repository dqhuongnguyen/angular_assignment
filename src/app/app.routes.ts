import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Poke Finder',
  },
  {
    path: 'pokedex',
    loadComponent: () => import('./pages/pokedex/pokedex').then((m) => m.Pokedex),
    title: 'Poke Finder · Pokedex',
  },
  {
    path: 'feedback',
    loadComponent: () => import('./pages/feedback/feedback').then((m) => m.Feedback),
    title: 'Poke Finder · Feedback',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
