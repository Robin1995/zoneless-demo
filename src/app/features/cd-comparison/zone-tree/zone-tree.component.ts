import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-zone-tree',
  // Default CD simula zone-based, pero en una app Zoneless necesitamos
  // signals para que el template se actualice
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'zone-tree.component.html',
  styleUrl: 'zone-tree.component.scss',
})
export class ZoneTreeComponent {
  readonly globalTick = signal(0);
  readonly renderA    = signal(0);
  readonly renderB    = signal(0);
  readonly renderC    = signal(0);
  readonly renderD    = signal(0);
  readonly renderE    = signal(0);
  readonly renderF    = signal(0);
  readonly renderG    = signal(0);
  readonly renderH    = signal(0);

  // Para los stats del panel padre
  readonly checkedCount = computed(() =>
    this.renderA() + this.renderB() + this.renderC() + this.renderD() +
    this.renderE() + this.renderF() + this.renderG() + this.renderH()
  );

  tick() {
    this.globalTick.update(n => n + 1);
    // Zone-based: TODOS los nodos se chequean
    this.renderA.update(n => n + 1); this.renderB.update(n => n + 1);
    this.renderC.update(n => n + 1); this.renderD.update(n => n + 1);
    this.renderE.update(n => n + 1); this.renderF.update(n => n + 1);
    this.renderG.update(n => n + 1); this.renderH.update(n => n + 1);
  }

  reset() {
    this.globalTick.set(0);
    this.renderA.set(0); this.renderB.set(0); this.renderC.set(0); this.renderD.set(0);
    this.renderE.set(0); this.renderF.set(0); this.renderG.set(0); this.renderH.set(0);
  }
}
