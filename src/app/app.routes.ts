// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'items' },
  {
    path: 'items',
    loadComponent: () =>
      import('./items-page/items-page').then((c) => c.ItemsPage),
    title: 'Items',
  },
  {
    path: 'items/:id',
    loadComponent: () =>
      import('./item-detail/item-detail').then((c) => c.ItemDetail),
    title: 'Item detail',
  },
];
