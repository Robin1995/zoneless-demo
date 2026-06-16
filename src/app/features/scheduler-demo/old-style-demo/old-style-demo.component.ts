import {
  Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../scheduler-demo.component';

const API = 'https://jsonplaceholder.typicode.com';

/**
 * Componente OnPush con variables normales (no signals).
 * Demuestra que en Zoneless:
 * - setInterval no triggea CD → vista queda stale sin markForCheck()
 * - HTTP subscribe no triggea CD → necesita markForCheck() manual
 */
@Component({
  selector: 'app-old-style-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'old-style-demo.component.html',
  styleUrl: 'old-style-demo.component.scss',
})
export class OldStyleDemoComponent implements OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  @Output() logEvent = new EventEmitter<string>();

  // ── setInterval ────────────────────────────────────────────────────────
  timerValue = 0;
  timerRunning = false;
  timerStale = false; // true cuando hay valor nuevo sin markForCheck
  private timerRef: ReturnType<typeof setInterval> | null = null;

  startTimerStale() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.timerStale = true;
    this.timerRef = setInterval(() => {
      this.timerValue++;
      // ❌ Sin markForCheck — la vista NO se actualiza
      // El Output sí llega al padre porque EventEmitter usa signals internamente
      this.logEvent.emit(`tick interno → timerValue = ${this.timerValue} | vista sigue mostrando ${this.timerValue - 1}`);
    }, 1000);
  }

  startTimerFixed() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.timerStale = false;
    this.timerRef = setInterval(() => {
      this.timerValue++;
      this.cdr.markForCheck(); // ✅ ahora sí se actualiza
    }, 1000);
  }

  stopTimer() {
    if (this.timerRef) clearInterval(this.timerRef);
    this.timerRunning = false;
  }

  resetTimer() {
    this.stopTimer();
    this.timerValue = 0;
    this.cdr.markForCheck();
  }

  // ── HTTP subscribe ─────────────────────────────────────────────────────
  post: Post | null = null;
  loading = false;
  postId = 1;
  postStale = false;

  fetchStale() {
    this.loading = true;
    this.postStale = true;
    this.logEvent.emit(`GET /posts/${this.postId} iniciado | vista NO muestra spinner (sin markForCheck)`);
    // ❌ Sin markForCheck — ni el spinner ni el resultado se muestran
    this.http.get<Post>(`${API}/posts/${this.postId}`).subscribe(p => {
      this.post = p;
      this.loading = false;
      this.postId = this.postId < 10 ? this.postId + 1 : 1;
      // ❌ Sin markForCheck — la vista no se actualiza
      this.logEvent.emit(`respuesta recibida: "${p.title.slice(0, 40)}..." | vista NO se actualiza (sin markForCheck)`);
    });
  }

  fetchFixed() {
    this.loading = true;
    this.postStale = false;
    this.cdr.markForCheck(); // ✅ para mostrar spinner
    this.http.get<Post>(`${API}/posts/${this.postId}`).subscribe(p => {
      this.post = p;
      this.loading = false;
      this.postId = this.postId < 10 ? this.postId + 1 : 1;
      this.cdr.markForCheck(); // ✅ para mostrar resultado
    });
  }

  ngOnDestroy() {
    if (this.timerRef) clearInterval(this.timerRef);
  }
}
