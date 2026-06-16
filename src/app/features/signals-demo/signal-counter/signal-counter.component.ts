import { Component, ChangeDetectionStrategy, input, computed, signal, effect } from '@angular/core';
import { UserStats } from '../normal-counter/normal-counter.component';

/**
 * Componente con OnPush que usa la API moderna input() signal (Angular 17+).
 *
 * Diferencias clave vs @Input():
 * - user es un Signal<UserStats> — readable como user()
 * - Se puede usar directamente en computed() y effect() sin ngOnChanges
 * - El template es un reactive consumer: cualquier lectura de user()
 *   crea una dependencia → re-render automático cuando cambia
 * - No necesita SimpleChanges ni markForCheck()
 */
@Component({
  selector: 'app-signal-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'signal-counter.component.html',
  styleUrl: 'signal-counter.component.scss',
})
export class SignalCounterComponent {
  // ── input() signal — API moderna ──────────────────────────────────────
  readonly user = input.required<UserStats>();

  // computed() derivados del input signal
  readonly scoreDoubled = computed(() => this.user().score * 2);
  readonly levelBadge   = computed(() => {
    const s = this.user().score;
    if (s >= 10) return { label: 'expert', cls: 'badge-green' };
    if (s >= 5)  return { label: 'pro',    cls: 'badge-blue' };
    if (s >= 2)  return { label: 'mid',    cls: 'badge-yellow' };
    return               { label: 'rookie', cls: 'badge-red' };
  });

  // Contamos re-renders reactivamente con effect()
  readonly renderCount  = signal(0);
  readonly lastRenderTime = signal('');

  constructor() {
    effect(() => {
      this.user(); // crea la dependencia
      this.renderCount.update(n => n + 1);
      this.lastRenderTime.set(
        new Date().toLocaleTimeString('es', { hour12: false })
      );
    });
  }
}
