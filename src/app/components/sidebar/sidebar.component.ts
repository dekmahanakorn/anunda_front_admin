import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/authentication.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
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

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;


  constructor(private router: Router,public authen: AuthenticationService) {
    authen.CheckAuthan();

  }

  ngOnInit() {

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }


}
