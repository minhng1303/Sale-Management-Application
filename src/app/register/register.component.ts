import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({})
  email="";
  password="";
  message = '';
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle
  existedUser;
  registerUser;
  constructor(
    private authservice: FirebaseService, 
    private fb: FormBuilder) 
    {
      this.registerForm = fb.group({
        email: ['',[Validators.required,Validators.email]],
        password: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(22)]]
      })
      
    }

  ngOnInit(): void {
    this.registerForm.valueChanges.subscribe(() => {
      this.clearErrorMessage();
    })
    this.authservice.getAccount.subscribe(user => {
         this.registerUser = user;
    })
    this.authservice.getExistedUser.subscribe(user => {
        this.existedUser = user
    })
  }

  clearErrorMessage()
  {
    this.message = '';
    this.errorMessage = '';
    this.error = {name : '' , message:''};
  }
  
  validateAccount(email) {
    let isExist: boolean = false;
    this.existedUser.map(user => {
      if (user.email === email) {
        isExist = true
      } 
    })
    if (!isExist) {
      this.registerUser.map(user => {
        if (user.email === email) {
          isExist = true
        }
      })
    }   
    return isExist 
  }

  register(email,password) {
    this.clearErrorMessage();
    let isExist: boolean = this.validateAccount(email);
    if (isExist) {
        this.errorMessage = 'Email bạn đăng kí đã tồn tại'
      } else {
        this.authservice.addRegistration(email,password);
        this.registerForm.reset()
        this.message = 'Đăng kí thành công! Vui lòng đợi admin confirm'
        console.log(this.message);
      }
  }

  get(val) {
    return this.registerForm.controls[val];
  }
  
  log() {
    console.log(this.registerForm); 
  }
}