import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ZoneTreeComponent } from './zone-tree/zone-tree.component';
import { ZonelessTreeComponent } from './zoneless-tree/zoneless-tree.component';

@Component({
  selector: 'app-cd-comparison',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZoneTreeComponent, ZonelessTreeComponent],
  templateUrl: './cd-comparison.component.html',
  styleUrl: './cd-comparison.component.scss',
})
export class CdComparisonComponent {}
