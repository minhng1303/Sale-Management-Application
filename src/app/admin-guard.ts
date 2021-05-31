import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: FirebaseService, private router: Router) {}
  canActivate(): boolean {
    if (!this.auth.loginUser.isAdmin) {
      this.router.navigate(['orders'])
      return false;
    }
    return this.auth.loginUser.isAdmin;
  }
}
