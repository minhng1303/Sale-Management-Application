import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { decode } from 'punycode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = null;
  admin: boolean = null;
  constructor(private router: Router) {}

  logIn(user) {
    console.log(user);
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.reGQzG3OKdoIMWLDKOZ4TICJit3EW69cQE72E2CfzRE'
    );
    this.loggedIn = true;
    this.router.navigate(['/']);
  }
  logOut() {
    this.loggedIn = false;
    localStorage.removeItem('token');
    this.router.navigate(['./login']);
  }

  isLogin(): boolean {
    if (this.loggedIn !== null) {
      return this.loggedIn;
    }
    let token = localStorage.getItem('token');
    if (token !== null) {
      this.loggedIn = true;
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.admin = decodedToken.admin;
      console.log(decodedToken);
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    return this.admin;
  }
}
