import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Output() public confirm = new EventEmitter<void>();
  @Output() public dismiss = new EventEmitter<void>();
  @Input() public isVisible: boolean = false;
  

  public onConfirm(): void {
    this.confirm.emit();
  }

  public onDismiss(): void {
    this.dismiss.emit();
  }
}
