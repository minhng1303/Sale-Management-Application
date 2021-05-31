import { FirebaseService } from './../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { StaffService } from '../services/StaffService/staff.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  account;
  constructor(
    private db: FirebaseService,
    private confirmDialog: ConfirmDialogService,
    private staffService: StaffService,
    private firebase: FirebaseService
  ) {}

  ngOnInit(): void {
    this.db.getExistedUser
      .pipe(
        map((res) => {
          res = res.filter((acc) => {
            return acc.email !== this.firebase.loginUser.email;
          });
          return res;
        })
      )
      .subscribe((res) => {
        this.account = res;
      });
  }

  deleteUser(acc) {
    this.confirmDialog
      .openConfirmDialog()
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.db.deleteUser(acc.email);
          this.staffService.deleteStaff(acc);
        }
      });
  }
}
