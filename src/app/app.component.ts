import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styles: [`
    :host { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

    header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 1.5rem;
      height: 52px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .logo {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text);
      white-space: nowrap;
      margin-right: 0.5rem;
    }
    .logo em { color: #3fb950; font-style: normal; }

    .badge {
      font-size: 0.6rem;
      background: rgba(63,185,80,.15);
      color: #3fb950;
      border: 1px solid #238636;
      border-radius: 999px;
      padding: 1px 7px;
      font-weight: 700;
      letter-spacing: .04em;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: 1;
    }

    nav a {
      font-size: 0.8rem;
      padding: 5px 12px;
      border-radius: 6px;
      color: var(--muted);
      text-decoration: none;
      border: 1px solid transparent;
      transition: all .15s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    nav a:hover { color: var(--text); background: var(--surface2); }
    nav a.active {
      color: var(--blue);
      border-color: rgba(88,166,255,.3);
      background: rgba(88,166,255,.08);
    }

    nav a .icon { font-size: 0.9rem; }

    .hint {
      font-size: 0.72rem;
      color: var(--muted);
      margin-left: auto;
      white-space: nowrap;
    }
    .hint code {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 1px 5px;
      color: var(--accent);
    }

    main { flex: 1; overflow-y: auto; }
  `],
  template: `
    <header>
      <span class="logo">Angular <em>Zoneless</em></span>
      <span class="badge">provideZonelessChangeDetection()</span>

      <nav aria-label="Demos técnicas">
        <a routerLink="/cd-comparison" routerLinkActive="active">
          <span class="icon">🌲</span> CD: Zone vs Zoneless
        </a>
        <a routerLink="/signals-demo" routerLinkActive="active">
          <span class="icon">⚡</span> Signals Demo
        </a>
        <a routerLink="/scheduler-demo" routerLinkActive="active">
          <span class="icon">🔔</span> Scheduler
        </a>
        <a routerLink="/extra-tips" routerLinkActive="active">
          <span class="icon">💡</span> Extra Tips
        </a>
      </nav>

      <span class="hint">Esta app corre en modo <code>Zoneless</code> — sin zone.js</span>
    </header>

    <main>
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
