import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private fireBase: FirebaseService) {}
  canActivate(): boolean {
    if (!this.fireBase.isAuthenticated) {
      this.router.navigate(['./login']);
      return false
    }  
    return true
  }
}
