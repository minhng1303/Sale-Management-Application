import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RegisterDialogComponent } from 'src/app/register-dialog/register-dialog.component';

@Component({
  selector: 'app-successful-dialog',
  templateUrl: './successful-dialog.component.html',
  styleUrls: ['./successful-dialog.component.css']
})
export class SuccessfulDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuccessfulDialogComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
