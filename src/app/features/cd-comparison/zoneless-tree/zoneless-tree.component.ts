import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-zoneless-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'zoneless-tree.component.html',
  styleUrl: 'zoneless-tree.component.scss',
})
export class ZonelessTreeComponent {
  readonly tick     = signal(0);
  readonly renderA  = signal(0);
  readonly renderB  = signal(0);
  readonly renderC  = signal(0);
  readonly renderD  = signal(0);
  readonly renderE  = signal(0);
  readonly renderF  = signal(0);
  readonly renderG  = signal(0);
  readonly renderH  = signal(0);

  // Para los stats del panel padre
  readonly checkedCount = computed(() =>
    this.renderA() + this.renderE() + this.renderF() + this.renderG()
  );
  readonly skippedCount = computed(() =>
    this.tick() === 0 ? 0 : 8 - this.checkedCount()
  );

  triggerChange() {
    this.tick.update(n => n + 1);
    // Zoneless: solo E (dirty) + F, G (consumen signal) + A (ancestor)
    this.renderA.update(n => n + 1);  // HasChildViewsToRefresh
    this.renderE.update(n => n + 1);  // fuente del cambio
    this.renderF.update(n => n + 1);  // consume signal title()
    this.renderG.update(n => n + 1);  // consume signal count()
    // B, C, D, H → NO se re-renderizan
  }

  reset() {
    this.tick.set(0);
    this.renderA.set(0); this.renderB.set(0); this.renderC.set(0); this.renderD.set(0);
    this.renderE.set(0); this.renderF.set(0); this.renderG.set(0); this.renderH.set(0);
  }
}
