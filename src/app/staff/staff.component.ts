import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Staff } from '../models/staff';
import { StaffService } from '../services/StaffService/staff.service';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  defaultImage: string =
    'data:image/png;base64,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';
  filePath: string = '';
  selectedStaff;
  nameValue: string;
  phoneValue: string;
  editMode: boolean = false;
  staff;
  sortedStaff;
  profileForm;

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService,
    private db: FirebaseService
  ) {
    this.profileForm = this.fb.group({
      account: [{ value: '', disabled: true }, Validators.required],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      imageURL: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.staffService
      .getStaff()
      .pipe(
        map((res) => {
          res = res.filter((acc) => {
            return acc.email !== this.db.loginUser.email;
          });
          return res;
        })
      )
      .subscribe((res) => {
        this.staff = res;
        this.sortedStaff = this.staff;
      });
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  updateStaff() {
    if (this.filePath == '') {
      this.staffService.updateStaff(
        this.selectedStaff.email,
        this.profileForm.value,
        this.defaultImage
      );
    } else {
      let filePath = `${this.profileForm.value.name}/${
        this.filePath['name']
      }_${new Date().getTime()}`;
      let fileRef = this.afStorage.ref(filePath);
      this.afStorage
        .upload(filePath, this.filePath)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              this.staffService.updateStaff(
                this.selectedStaff.email,
                this.profileForm.value,
                url
              );
            });
          })
        )
        .subscribe();
    }
    this.editMode = false;
  }

  deleteStaff(item) {
    this.confirmDialog
      .openConfirmDialog()
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.staffService.deleteStaff(item);
          this.db.deleteUser(item.email);
        }
      });
  }

  edit(staff) {
    this.selectedStaff = staff;
    this.profileForm.patchValue({
      account: staff.email,
      name: staff.name,
      phone: staff.phone,
      address: staff.address,
      gender: staff.gender,
      dob: staff.dob,
      // imageURL: staff.imageURL
    });
    this.editMode = true;
  }
  goBack() {
    this.editMode = false;
  }

  searchName() {
    // if (this.phoneValue != '') {
    //   this.sortedStaff = this.sortedtaff.filter(item => {
    //     return (item.name.toLowerCase().replace(/\s/g, '')
    //     .includes(this.nameValue.toLowerCase().replace(/\s/g, '')))
    //     })
    //     return
    //   }
    this.sortedStaff = this.staff.filter((item) => {
      return item.name
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.nameValue.toLowerCase().replace(/\s/g, ''));
    });
  }

  searchPhone() {
    // if (this.nameValue != '') {
    //   this.sortedStaff = this.sortedStaff.filter(item => {
    //     return (String(item.phone)).includes(String(this.phoneValue))
    //     })
    //     return
    //   }
    this.sortedStaff = this.staff.filter((item) => {
      return (0 + String(item.phone)).includes(String(this.phoneValue));
    });
  }

  upload(event) {
    this.filePath = event.target.files[0];
    console.log(this.filePath);
  }
}
