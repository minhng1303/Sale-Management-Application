import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth' 
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from '../models/account';
import { Staff } from '../models/staff';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService  {
  private todayRevenue: number;
  registerUser: Observable<Account[]>;
  existedUser: Observable<Account[]>;
  authState: any = null;
  loginUser: {
    email: string,
    token: string,
    isAdmin?: boolean
  }
  isLogged: boolean = false;
  constructor(private afu: AngularFireAuth, 
              private router: Router, 
              public db: AngularFirestore,
              private firebase: AngularFireDatabase) { 
    this.afu.authState.subscribe(auth =>{
      this.authState = auth;
    })
    this.registerUser = this.db.collection<Account>('account').valueChanges();
    this.existedUser = this.db.collection<Account>('users').valueChanges();
  }

  setRevenue(a:number) {
    this.todayRevenue = a
  }

  get getRevenue() {
    return this.todayRevenue
  }
  // all firebase getdata functions
  get getExistedUser() {
    return this.existedUser;
  }

  get getAccount() {
    return this.registerUser;
  }

  get isAuthenticated(): boolean {
    let user = localStorage.getItem('user');
    if (!this.loginUser) {
      if (!user) {
        this.loginUser = JSON.parse(user);
        return false
      }
    }
    this.loginUser = JSON.parse(user);
    this.isLogged = true
    return true
  }

  get isAdmin(): boolean {
    let user = localStorage.getItem('user');
    if (!this.loginUser) {
      if (!user) {
        this.loginUser = JSON.parse(user);
        return false
      }
    }
    this.loginUser = JSON.parse(user);
    return this.loginUser.isAdmin;
  }

  registerWithEmail(email1: string, password1: string) {
    return this.afu.createUserWithEmailAndPassword(email1, password1)
      .then((user) => {
        this.authState = user;
        this.db.collection('users').add({
          date: new Date().toLocaleString("en-US"),
          email: email1,
          password: password1,
          isAdmin: false
        })
      })
      .catch(error => {
        console.log(error)
        throw error
      }); 
  }

  async updateStaff(email, form,url) {
    let ref; 
    await this.db.collection('staff', ref => ref.where('email','==',email)
    .limit(1))
    .snapshotChanges()
    .subscribe(doc => {
        ref = doc[0].payload.doc.ref.id
        this.db.collection<Staff>('staff').doc(ref).update({
          name: form.name || '',
          address: form.address || '',
          dob: form.dob || '',
          gender: form.gender || '',
          imageURL: url,
          phone: form.phone || ''
        })
      })        
    }

  loginWithEmail(email: string, password: string, isAdmin: boolean)
  {
    return this.afu.signInWithEmailAndPassword(email, password)
      .then((userData) => {
        this.loginUser = {
          isAdmin: isAdmin,
          email: userData.user.email,
          token: userData.user.refreshToken
        }        
        localStorage.setItem('user', JSON.stringify(this.loginUser))        
      })
      .catch(error => {
        throw error
      });
  }

  singout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  addRegistration(email1,password1) {
    this.db.collection('account').add({
      date: new Date().toLocaleString("en-US"),
      email: email1,
      password: password1
    })
  }

  async deleteRegistration(email1) {
    await this.db.collection('account').get().subscribe(data => {
      data.docs.forEach(item => {
        let ele = item.data();
        if (email1 == ele['email']) {
          this.db.collection('account').doc(item.id).delete();
        }
      })
    })
  }

  async deleteUser(email) {
    await this.db.collection('users').get().subscribe(data => {
      data.docs.forEach(item => {
        let ele = item.data();
        if (email == ele['email']) {
          console.log(ele['email']);
          this.db.collection('users').doc(item.id).delete();
        }
      })
    })
  }
}