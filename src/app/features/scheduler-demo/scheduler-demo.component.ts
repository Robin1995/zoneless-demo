import {
  Component, ChangeDetectionStrategy,
  signal, computed, inject, OnDestroy
} from '@angular/core';import { httpResource, HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { OldStyleDemoComponent } from './old-style-demo/old-style-demo.component';

export interface Post { id: number; title: string; body: string; }
interface LogEntry { id: number; time: string; side: 'old' | 'new'; msg: string; }

const API = 'https://jsonplaceholder.typicode.com';

@Component({
  selector: 'app-scheduler-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OldStyleDemoComponent],
  templateUrl: './scheduler-demo.component.html',
  styleUrl: './scheduler-demo.component.scss',
})
export class SchedulerDemoComponent implements OnDestroy {
  private http = inject(HttpClient);

  // ── DERECHA: ahora — signals + resource APIs ───────────────────────────

  readonly signalTimer = signal(0);
  readonly signalTimerRunning = signal(false);
  private signalTimerRef: ReturnType<typeof setInterval> | null = null;

  startSignalTimer() {
    if (this.signalTimerRunning()) return;
    this.signalTimerRunning.set(true);
    this.signalTimerRef = setInterval(() => {
      this.signalTimer.update(n => n + 1);
      this.addLog('new', `tick → signal.update() → CD automatica`);
    }, 1000);
  }

  stopSignalTimer() {
    if (this.signalTimerRef) clearInterval(this.signalTimerRef);
    this.signalTimerRunning.set(false);
    this.addLog('new', 'timer detenido');
  }

  resetSignalTimer() {
    this.stopSignalTimer();
    this.signalTimer.set(0);
  }

  // httpResource
  readonly httpPostId = signal(1);
  readonly postResource = httpResource<Post>(
    () => `${API}/posts/${this.httpPostId()}`
  );
  readonly currentHttpPost = this.postResource.value;
  readonly httpPostLoading = this.postResource.isLoading;
  readonly httpPost_id     = computed(() => this.postResource.value()?.id);
  readonly httpPost_title  = computed(() => this.postResource.value()?.title);

  fetchNextHttp() {
    this.httpPostId.update(id => id < 10 ? id + 1 : 1);
    this.addLog('new', `httpPostId → ${this.httpPostId()} | httpResource recarga sola`);
  }

  // rxResource
  readonly rxPostId = signal(1);
  readonly rxPostResource = rxResource<Post, number>({
    params: () => this.rxPostId(),
    stream: ({ params: id }) => {
      this.addLog('new', `rxResource stream → GET /posts/${id}`);
      return this.http.get<Post>(`${API}/posts/${id}`);
    },
  });
  readonly currentRxPost = this.rxPostResource.value;
  readonly rxPostLoading  = this.rxPostResource.isLoading;
  readonly rxPost_id      = computed(() => this.rxPostResource.value()?.id);
  readonly rxPost_title   = computed(() => this.rxPostResource.value()?.title);

  fetchNextRx() {
    this.rxPostId.update(id => id < 10 ? id + 1 : 1);
    this.addLog('new', `rxPostId → ${this.rxPostId()} | rxResource recarga sola`);
  }

  // ── Log ────────────────────────────────────────────────────────────────
  readonly logs = signal<LogEntry[]>([]);
  private logId = 0;

  private addLog(side: 'old' | 'new', msg: string) {
    const time = new Date().toLocaleTimeString('es', { hour12: false });
    this.logs.update(l => [{ id: this.logId++, time, side, msg }, ...l].slice(0, 80));
  }

  clearLog() { this.logs.set([]); }

  addOldLog(msg: string) {
    this.addLog('old', msg);
  }

  // ── Snippets para los <pre> ────────────────────────────────────────────
  readonly timerNewCode = [
    'setInterval(() => {',
    '  this.signalTimer.update(n => n + 1);',
    '  // CD automatica — sin markForCheck()',
    '}, 1000);',
  ].join('\n');

  readonly httpResourceCode = [
    'readonly postResource = httpResource<Post>(',
    '  () => `/posts/${this.httpPostId()}`',
    ');',
    '// httpPostId cambia => refetch automatico',
  ].join('\n');

  readonly rxResourceCode = [
    'readonly rxPost = rxResource({',
    '  params: () => this.rxPostId(),',
    '  stream: ({ params: id }) =>',
    '    this.http.get(`/posts/${id}`)',
    '});',
  ].join('\n');

  ngOnDestroy() {
    if (this.signalTimerRef) clearInterval(this.signalTimerRef);
  }
}
