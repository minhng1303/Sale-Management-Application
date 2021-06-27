import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { FirebaseService } from '../services/firebase.service';
import { StaffService } from '../services/StaffService/staff.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  users = [];
  constructor(
    private authservice: FirebaseService,
    public dialog: MatDialog,
    public dialogService: ConfirmDialogService,
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.authservice.getAccount.forEach((item) => {
      this.users = item;
    });
  }

  get openDialog() {
    return this.dialogService.openConfirmDialog();
  }

  async register(email, password) {
    this.openDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.authservice
          .registerWithEmail(email, password)
          .then((res) => {
            this.authservice.deleteRegistration(email);
            this.staffService.addStaff(email);
            this.dialogService.openSuccessfulDialog();
          })
          .catch((err) => {
            if (err.code == 'auth/email-already-in-use') {
              this.staffService.addStaff(email);
              this.authservice.addUser(email, password)
              this.authservice.deleteRegistration(email);
              this.dialogService.openSuccessfulDialog();
              console.log('successful');
            }
          });
      }
    });
  }

  deny(email) {
    this.openDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.authservice.deleteRegistration(email);
      }
    });
  }
}
