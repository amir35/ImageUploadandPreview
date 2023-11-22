import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-image',
  templateUrl: './delete-image.component.html',
  styleUrls: ['./delete-image.component.css']
})
export class DeleteImageComponent {

  id : number;

  constructor(public dialogRef: MatDialogRef<DeleteImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      console.log(data.id);
      this.id = data.id;
    }

  onOk() {
    const dataToSendBack = true;
    console.log(dataToSendBack);

    this.dialogRef.close(dataToSendBack);
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog
  }


}
