// items/items-page.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

type Item = { id: number; userId: number; title: string; body: string };

@Component({
  standalone: true,
  selector: 'app-items-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './items-page.html',
  styleUrls: ['./items-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsPage implements OnDestroy {
  ngOnDestroy(): void {
    console.log('ItemsPage destroyed');
  }
  private http = inject(HttpClient);

  // filtros (se conservan al volver gracias a la strategy)
  q = signal<string>('');
  user = signal<number | 'all'>('all');

  // datos remotos
  items = signal<Item[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // cargar datos (una sola vez por instancia)
  constructor() {
    this.fetch();
  }

  private async fetch() {
    try {
      this.loading.set(true);
      const data = await this.http
        .get<Item[]>('https://jsonplaceholder.typicode.com/posts')
        .toPromise();
      this.items.set(data ?? []);
    } catch {
      this.error.set('No se pudo cargar');
    } finally {
      this.loading.set(false);
    }
  }

  filtered = computed(() => {
    const q = this.q().toLowerCase().trim();
    const u = this.user();
    return this.items().filter((it) => {
      const byUser = u === 'all' ? true : it.userId === u;
      const byText = !q
        ? true
        : (it.title + ' ' + it.body).toLowerCase().includes(q);
      return byUser && byText;
    });
  });

  // opcional: restaurar scroll al volver (si lo quieres manual, aunque al reusar vista suele mantenerse)
  _saveScroll = effect(() => {
    // no-op, pero puedes leer filtered().length y usar scrollRestoration si tienes lógica propia
  });
}
