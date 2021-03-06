import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthenticationService } from 'src/app/shared/authentication.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  email: string;
  password: string;

  constructor(public authenticationService: AuthenticationService, private router: Router) {

   }



  signIn() {
    this.authenticationService.SignIn(this.email, this.password);
    this.email = null;
    this.password = null;
  }
  signed() {
    this.router.navigate(['/dashboard']);
  }

  signOut() {
    this.authenticationService.SignOut();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

}
