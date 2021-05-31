import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { StaffService } from '../services/StaffService/staff.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  currentUser = {};
  url: string = ''
  constructor(public auth: FirebaseService, private route: Router, private activatedRoute: ActivatedRoute, private staffService: StaffService ) {}
  arr = {
  showDropDown: false,
  showExchange: false,
  showRes: false,
  showAcc: false,
  showPeop: false,
  }

  ngOnInit(): void {
    this.getUserImage();
    this.route.events.subscribe(() => {
      this.arr = {
        showDropDown: false,
        showExchange: false,
        showRes: false,
        showAcc: false,
        showPeop: false,
        }
    })
    this.currentUser = this.auth.loginUser;
    console.log(this.auth.loginUser);
  }

  getUserImage() {
    this.staffService.getStaff().subscribe(res => {
      this.url = (res.filter(ele => ele.email == this.auth.loginUser.email))[0].imageURL
    })
  }

  dropdown(item) {
    if (this.arr[item] == true) {
      this.arr[item] = false;
      return
    }    
    Object.getOwnPropertyNames(this.arr).map(ele => {
      if (ele == item) {
        this.arr[ele] = true                
      } else {
      this.arr[ele] = false
      }
    })
    console.log(this.arr[item]);
  }
  
  logOut() {
    this.auth.singout();
    this.route.navigate(['login']);
  }

  goToProfile() {
    this.route.navigate(['profile'])
  }
}
