import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from '../services/firebase.service';
import { StaffService } from '../services/StaffService/staff.service';

@Component({
  selector: 'app-permisson',
  templateUrl: './permisson.component.html',
  styleUrls: ['./permisson.component.css'],
})
export class PermissonComponent implements OnInit {
  accountName: string = '';
  account;
  sortedAccount = [];
  constructor(
    private firebase: FirebaseService,
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    this.firebase.getExistedUser.subscribe((res) => {
      this.sortedAccount = res;
      this.account = res.filter((acc) => {
        return acc.email != this.firebase.loginUser.email;
      });
    });
  }

  makeAdmin(acc) {
    this.staffService.makeAdmin(acc);
  }

  removeAdmin(acc) {
    this.staffService.removeAdmin(acc);
    if (acc.email == this.firebase.loginUser.email) {
      this.firebase.singout();
    }
  }

  searchByName() {
    this.account = this.sortedAccount.filter((acc) => {
      return acc['email']
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.accountName.toLowerCase().replace(/\s/g, ''));
    });
  }
}
