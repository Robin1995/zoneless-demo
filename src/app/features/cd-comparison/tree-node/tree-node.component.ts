import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tree-node.component.html',
  styleUrl: 'tree-node.component.scss',
})
export class TreeNodeComponent {
  @Input() label = 'A';
  @Input() renderCount = 0;
  @Input() isDirty = false;
  @Input() wasChecked = false;
  @Input() showContent = false;
  @Input() content = '';
  @Input() children: string[] = [];
}
