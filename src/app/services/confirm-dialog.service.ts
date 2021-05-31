import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessfulDialogComponent } from '../material/successful-dialog/successful-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(){
   return this.dialog.open(RegisterDialogComponent,{
      width: '350px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: "150px" },
    });
  }

  openSuccessfulDialog() {
    return this.dialog.open(SuccessfulDialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: "150px" },
    })
  }
}

