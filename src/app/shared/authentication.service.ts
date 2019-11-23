import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { User } from 'firebase';

import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: Observable<firebase.User>;
  user:  User;

  constructor(public angularFireAuth: AngularFireAuth,private router: Router) {
    this.userData = angularFireAuth.authState;

  }

  /* Sign up */
  SignUp(email: string, password: string) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed up!', res);
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });
  }

  /* Sign in */
  async SignIn(email: string, password: string) {

    this.angularFireAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
    console.log('cerrent', this.user);


    this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          console.log('Successfully signed in!');
          this.router.navigate(['/dashboard']);
        }).catch(err => {
            console.log('Something is wrong:', err.message);
        });
    }

  /* Sign out */
  async SignOut() {
    await this.angularFireAuth.auth.signOut().then(() => {
      localStorage.setItem('user', null);
      this.router.navigate(['/login']);
      this.user = null;
      console.log('signout Success'); });
  }

  CheckAuthan(){
    if(this.user){
      this.router.navigate(['/Dashboard']);
    }else{
      this.router.navigate(['/login']);
    }
  }




}

