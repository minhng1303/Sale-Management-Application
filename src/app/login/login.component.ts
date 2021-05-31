import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  existedUser = [];
  email = "";
  password = "";
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle
  constructor(private auth: FirebaseService, private router: Router, private fb: FormBuilder) {
    
   }

  ngOnInit(): void {
    this.auth.getExistedUser.subscribe(res => {
      this.existedUser = res;   
    })
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  isAdmin(email) {
    let isAdmin: boolean = false;
      this.existedUser.forEach(user => {
        if (user.email == email) {
          isAdmin = user.isAdmin;
        }
    })
    return isAdmin;    
  }

  checkUser(email) {
    const user = this.existedUser.find(user => {
      return user.email == email
    })
    return user    
  }

  
  login()
  {
    this.clearErrorMessage();
    if (this.checkUser(this.email)) {
    this.auth.loginWithEmail(this.email, this.password, this.isAdmin(this.email))
      .then(() => {
        this.router.navigate(['/orders'])
      }).catch(_error => {
        console.log(_error);
        
        if (_error.code.includes('wrong-password')) {
          this.error.message = 'Mật khẩu không hợp lệ'
          this.error.name = 'wrong-password'
        }
      })  
      return
    }
    this.checkValid();
  }

  checkValid() {
    if (this.email == '' || this.password == '') {
      this.errorMessage = 'Email hoặc mật khẩu không hợp lệ'
      return
    }  
    this.errorMessage = 'Email hoặc mật khẩu không hợp lệ'
  }

}
