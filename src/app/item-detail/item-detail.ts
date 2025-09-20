// items/item-detail.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

type Item = { id: number; userId: number; title: string; body: string };

@Component({
  standalone: true,
  selector: 'app-item-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <a routerLink="/items">← Volver</a>
    <section *ngIf="item(); else loading">
      <h2>{{ item()!.title }}</h2>
      <p>
        <strong>ID:</strong> {{ item()!.id }} — <strong>User:</strong>
        {{ item()!.userId }}
      </p>
      <p>{{ item()!.body }}</p>
    </section>
    <ng-template #loading><p>Cargando…</p></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetail {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  item = signal<Item | null>(null);

  constructor() {
    effect(
      () => {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.load(id);
      },
      { allowSignalWrites: true }
    );
  }

  private async load(id: number) {
    this.item.set(null);
    const data = await this.http
      .get<Item>('https://jsonplaceholder.typicode.com/posts/' + id)
      .toPromise();
    this.item.set(data ?? null);
  }
}
