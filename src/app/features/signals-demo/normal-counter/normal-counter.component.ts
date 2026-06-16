import {
  Component, ChangeDetectionStrategy,
  Input, OnChanges, SimpleChanges,
  inject,
  ChangeDetectorRef
} from '@angular/core';

export interface UserStats {
  name: string;
  score: number;
  level: string;
}

@Component({
  selector: 'app-normal-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'normal-counter.component.html',
  styleUrl: 'normal-counter.component.scss',
})
export class NormalCounterComponent implements OnChanges {
  @Input() user!: UserStats;
  
  renderCount = 0;
  lastRenderTime = '';

  ngOnChanges(changes: SimpleChanges) {
    // Solo se ejecuta cuando Angular detecta una nueva referencia de @Input
    if (changes['user']) {
      this.renderCount++;
      this.lastRenderTime = new Date().toLocaleTimeString('es', { hour12: false });
    }
  }

}
