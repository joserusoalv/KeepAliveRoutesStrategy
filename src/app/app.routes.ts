// app.routes.ts
import { Routes } from '@angular/router';
import { ItemDetail } from './item-detail/item-detail';
import { ItemsPage } from './items-page/items-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'items' },
  { path: 'items', component: ItemsPage, title: 'Items' },
  { path: 'items/:id', component: ItemDetail, title: 'Item detail' },
];
