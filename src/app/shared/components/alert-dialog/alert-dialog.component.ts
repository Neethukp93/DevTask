import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent implements OnInit {
  title: string = '';
  message: string = '';
  buttonText = 'OK';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) {
    if (data) {
      this.title = data.title || this.title;
      this.message = data.message || this.message;

      if (data.buttonText) {
        this.buttonText = data.buttonText || this.buttonText;
      }
    }
  }

  ngOnInit() {}
}
