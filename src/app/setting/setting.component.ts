import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { VirtualTimeScheduler } from 'rxjs';
import { finalize, flatMap } from 'rxjs/operators';
import { Staff } from '../models/staff';
import { FirebaseService } from '../services/firebase.service';
import { StaffService } from '../services/StaffService/staff.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  filePath: string = '';
  userEmail: string;
  clientRef: string;
  currentStaff: Staff[];
  currentUser;
  myDatePicker: Date;
  editMode: boolean = false;
  profileForm;
  validMode: boolean = false;
  constructor(private fb: FormBuilder, 
              private router: Router, 
              private staffService: StaffService, 
              private firebase: FirebaseService,
              private afStorage: AngularFireStorage,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide()
    },300)
    this.userEmail = this.firebase.loginUser.email;         
    this.createForm();
    this.staffService.getStaff().subscribe(ele => {
      this.currentStaff = ele.filter(item => {
        return (item['email'] === this.userEmail);
        })
        this.profileForm.patchValue({
          account: this.userEmail,
          name: this.currentStaff[0].name,
          phone: this.currentStaff[0].phone,
          address: this.currentStaff[0].address,
          gender: this.currentStaff[0].gender,
          dob: this.currentStaff[0].dob,
        })
      })
     
     }

  createForm() {
    this.profileForm = this.fb.group({
      account: [{value: '', disabled: true}, Validators.required],
      name: [{value: '', disabled: !this.isEdit},[Validators.required]],
      phone: [{value: '', disabled: !this.isEdit},[Validators.required]],
      imageURL: [{value: '', disabled: !this.isEdit},[Validators.required]],
      dob: [{value: '', disabled: !this.isEdit},[Validators.required]],
      gender: [{value: '', disabled: !this.isEdit},[Validators.required]],
      address: [{value: '', disabled: !this.isEdit},[Validators.required]],
    })  
  }
  
  updateStaff() {
    this.spinner.show();
    if (this.filePath == '') {
      this.staffService.updateStaff(this.userEmail, this.profileForm.value, this.currentStaff[0].imageURL);
      this.profileForm.disable();
      this.editMode = false;
      this.router.navigate(['profile'])
      setTimeout(() => {
        this.spinner.hide()
      },300)
    }
    else {
      this.spinner.show();
  let filePath = `${this.profileForm.value.name}/${this.filePath['name']}_${new Date().getTime()}`
    let fileRef = this.afStorage.ref(filePath)
    this.afStorage.upload(filePath, this.filePath).snapshotChanges().pipe(finalize(() =>{
      fileRef.getDownloadURL().subscribe((url) => { 
        this.staffService.updateStaff(this.userEmail, this.profileForm.value,url)
        })
    })).subscribe()
    this.profileForm.disable();
    this.editMode = false;
    setTimeout(() => {
      this.spinner.hide()
    },300)
    }
  }

  get isEdit(): boolean {
    return (this.editMode)
  }

  upload(event) {    
    this.filePath = event.target.files[0] 
    console.log(this.filePath);
  }

  log() {
    console.log(this.profileForm.value);
  }
  
  changeEditMode() {
    this.editMode = true;   
    this.profileForm.controls.name.enable();
    this.profileForm.controls.phone.enable();
    this.profileForm.controls.imageURL.enable();
    this.profileForm.controls.dob.enable();
    this.profileForm.controls.gender.enable();
    this.profileForm.controls.address.enable();

  }

  goBack() {
    this.profileForm.disable();
    this.editMode = false;
  }
}
