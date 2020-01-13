import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { AngularFireAuth } from "@angular/fire/auth";

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES_SA: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-red', class: '' },
  { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' },
  { path: '/profile', title: 'Intro-profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/About', title: 'About', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/Contact', title: 'Contact', icon: 'ni-collection text-red', class: '' },
  { path: '/add-Product', title: 'Add Product', icon: 'ni-bullet-list-67 text-info', class: '' },
  { path: '/product-category', title: 'Add Product category', icon: 'ni-key-25 text-info', class: '' },
  { path: '/partner', title: 'Add your Partner', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/add-product-solution', title: 'Add product solution', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/template', title: 'Import template', icon: 'ni-collection text-info', class: '' },
];

export const ROUTES_A: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-red', class: '' },
  { path: '/profile', title: 'Intro-profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/About', title: 'About', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/Contact', title: 'Contact', icon: 'ni-collection text-red', class: '' },
  { path: '/add-Product', title: 'Add Product', icon: 'ni-bullet-list-67 text-info', class: '' },
  { path: '/product-category', title: 'Add Product category', icon: 'ni-key-25 text-info', class: '' },
  { path: '/partner', title: 'Add your Partner', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/add-product-solution', title: 'Add product solution', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/template', title: 'Import template', icon: 'ni-collection text-info', class: '' },
];

export const ROUTES_U: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-red', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems_sa: any[];
  public menuItems_a: any[];
  public menuItems_u: any[];
  public isCollapsed = true;

  userData: Observable<firebase.User>;

  check_Email_Auth: string;
  check_login = false;
  status: string;
  dataRegister: any;

  constructor(private router: Router,
    public authenticationService: AuthenticationService,
    public angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore, ) {

    this.userData = angularFireAuth.authState;

  }

  ngOnInit() {

    this.checkStatus();

    this.menuItems_sa = ROUTES_SA.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    this.menuItems_a = ROUTES_A.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    this.menuItems_u = ROUTES_U.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  checkStatus() {
    this.userData.subscribe(res => {
      if (res && res.uid) {
        this.check_Email_Auth = res.email;
        this.check_login = true;
        console.log('Check Email Auth : ', this.check_Email_Auth);
        console.log('Check login : ', this.check_login);

        var inner = this;
        this.firestore.collection("register").get().subscribe(function (query) {
          query.forEach(function (doc) {
            if (doc.data().email == inner.check_Email_Auth) {
              inner.status = doc.data().status;
              inner.dataRegister = Object.assign({}, doc.data());

              console.log('Check status : ', inner.status);
              console.log('All data register : ', inner.dataRegister);
            }
          })
        })

      } else {
        console.log('user not logged in');
      }
    });
  }


}
