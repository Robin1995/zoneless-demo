import {
  Component, ChangeDetectionStrategy,
  signal, computed, effect,
  inject,
  ChangeDetectorRef,
  viewChild
} from '@angular/core';
import { NormalCounterComponent, UserStats } from './normal-counter/normal-counter.component';
import { SignalCounterComponent } from './signal-counter/signal-counter.component';

@Component({
  selector: 'app-signals-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NormalCounterComponent, SignalCounterComponent],
  templateUrl: './signals-demo.component.html',
  styleUrl: './signals-demo.component.scss',
})
export class SignalsDemoComponent {
  // ── Escenario A: mutación directa — misma referencia ──────────────────
  // El padre muta user.score directamente → el hijo OnPush NO lo detecta
  // porque la referencia del objeto no cambió
  userA: UserStats = { name: 'Alice', score: 0, level: 'rookie' };

  mutateA() {
    this.userA.score++;           // ← mutación directa, misma referencia
    this.updateLevel(this.userA);
    this.addLog('normal',
      `userA.score++ → ${this.userA.score} | misma referencia → hijo NO re-renderiza`
    );
  }

  resetA() {
    this.userA.score = 0;
    this.userA.level = 'rookie';
    // Para que el hijo se entere del reset, necesitamos nueva referencia
    this.userA = { ...this.userA };
    this.addLog('normal', `reset con spread → nueva referencia → hijo re-renderiza`);
  }

  // ── Escenario B: spread operator — nueva referencia ───────────────────
  // El padre crea un nuevo objeto con spread → Angular detecta la nueva referencia
  // El hijo OnPush SÍ se re-renderiza
  userB: UserStats = { name: 'Bob', score: 0, level: 'rookie' };

  updateB() {
    this.userB = {              // ← nueva referencia con spread
      ...this.userB,
      score: this.userB.score + 1,
    };
    this.updateLevel(this.userB);
    this.addLog('normal',
      `userB = { ...userB, score: ${this.userB.score} } | nueva referencia → hijo SÍ re-renderiza`
    );
  }

  resetB() {
    this.userB = { name: 'Bob', score: 0, level: 'rookie' };
    this.addLog('normal', `userB reset → nueva referencia`);
  }

  // ── Escenario C: Signal — siempre reactivo ────────────────────────────
  readonly userSignal = signal<UserStats>({ name: 'Carol', score: 0, level: 'rookie' });
  readonly scoreDoubled = computed(() => this.userSignal().score * 2);

  constructor() {
    effect(() => {
      const u = this.userSignal();
      this.addLog('effect', `effect() → score = ${u.score} | level = ${u.level}`);
    });
  }

  updateSignal() {
    this.userSignal.update(u => {
      const next = { ...u, score: u.score + 1 };
      this.updateLevel(next);
      return next;
    });
    this.addLog('signal',
      `userSignal.update() → score = ${this.userSignal().score} | doubled = ${this.scoreDoubled()}`
    );
  }

  resetSignal() {
    this.userSignal.set({ name: 'Carol', score: 0, level: 'rookie' });
    this.addLog('signal', `userSignal.set() → reset`);
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  private updateLevel(user: UserStats) {
    if (user.score >= 10) user.level = 'expert';
    else if (user.score >= 5) user.level = 'pro';
    else if (user.score >= 2) user.level = 'mid';
    else user.level = 'rookie';
  }

  // ── Log ────────────────────────────────────────────────────────────────
  readonly logs = signal<{ id: number; time: string; msg: string; type: string }[]>([]);
  private logId = 0;

  private addLog(type: string, msg: string) {
    const time = new Date().toLocaleTimeString('es', { hour12: false });
    this.logs.update(l => [{ id: this.logId++, time, msg, type }, ...l].slice(0, 50));
  }

  clearLog() { this.logs.set([]); }
}
