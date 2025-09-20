// route-reuse/provide-route-reuse.ts
import { Provider } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

type Options = {
  /** rutas (path del routeConfig) a cachear via detach/attach */
  cachePaths: string[];
  /** tamaño máximo del caché por ruta */
  maxPerPath?: number;
};

export class KeepAliveRoutesStrategy extends BaseRouteReuseStrategy {
  private cache = new Map<string, DetachedRouteHandle[]>();
  private opts: Required<Options>;

  constructor(opts: Options) {
    super();
    this.opts = { maxPerPath: 1, ...opts };
  }

  // Clave de caché: path estático del routeConfig (sin params)
  private key(route: ActivatedRouteSnapshot): string | null {
    const cfg = route.routeConfig;
    return cfg?.path ?? null;
  }

  override shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const k = this.key(route);
    return !!k && this.opts.cachePaths.includes(k);
  }

  override store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle
  ): void {
    const k = this.key(route);
    if (!k || !handle) return;
    const arr = this.cache.get(k) ?? [];
    // política simple: 1 por ruta; si quieres, guarda por query/params aquí
    if (arr.length >= this.opts.maxPerPath!) arr.shift();
    arr.push(handle);
    this.cache.set(k, arr);
  }

  override shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const k = this.key(route);
    return !!k && !!this.cache.get(k)?.length;
  }

  override retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const k = this.key(route);
    if (!k) return null;
    const arr = this.cache.get(k);
    return arr && arr.length ? arr[arr.length - 1] : null;
  }

  // Mantén la lógica base para reusar componentes cuando solo cambian params/query/fragment
  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return super.shouldReuseRoute(future, curr);
  }

  /** API opcional por si quieres limpiar caché (logout, hard refresh, etc.) */
  clear(path?: string) {
    if (path) this.cache.delete(path);
    else this.cache.clear();
  }
}

export function provideRouteReuse(opts: Options): Provider {
  return {
    provide: RouteReuseStrategy,
    useFactory: () => new KeepAliveRoutesStrategy(opts),
  };
}
