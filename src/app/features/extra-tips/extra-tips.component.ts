import {
  Component, ChangeDetectionStrategy,
  signal, inject, Injector, afterNextRender
} from '@angular/core';

@Component({
  selector: 'app-extra-tips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './extra-tips.component.html',
  styleUrl: './extra-tips.component.scss',
})
export class ExtraTipsComponent {
  // Inyectamos el Injector para poder llamar afterNextRender()
  // fuera del injection context (desde un event handler)
  private injector = inject(Injector);

  readonly afterRenderMsg = signal('');

  runAfterNextRender() {
    this.afterRenderMsg.set('');
    // Se pasa el injector como opción para satisfacer el injection context
    afterNextRender(
      () => {
        this.afterRenderMsg.set(
          `Ejecutado tras el render — ${new Date().toLocaleTimeString('es')}`
        );
      },
      { injector: this.injector }
    );
  }
}
