import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'dialog-cost',
  templateUrl: 'dialog-cost.template.html',
})
export class DialogCostComponent {
  cost: FormControl = new FormControl()
  constructor(
    public dialogRef: MatDialogRef<DialogCostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.cost.patchValue(data.cost);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
