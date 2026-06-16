import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cd-comparison', pathMatch: 'full' },
  {
    path: 'cd-comparison',
    loadComponent: () =>
      import('./features/cd-comparison/cd-comparison.component').then(
        (m) => m.CdComparisonComponent
      ),
  },
  {
    path: 'signals-demo',
    loadComponent: () =>
      import('./features/signals-demo/signals-demo.component').then(
        (m) => m.SignalsDemoComponent
      ),
  },
  {
    path: 'scheduler-demo',
    loadComponent: () =>
      import('./features/scheduler-demo/scheduler-demo.component').then(
        (m) => m.SchedulerDemoComponent
      ),
  },
  {
    path: 'extra-tips',
    loadComponent: () =>
      import('./features/extra-tips/extra-tips.component').then(
        (m) => m.ExtraTipsComponent
      ),
  },
  { path: '**', redirectTo: 'cd-comparison' },
];
