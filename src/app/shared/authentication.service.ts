import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: Observable<firebase.User>;
  public user: User;

  constructor(public angularFireAuth: AngularFireAuth, private router: Router) {
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
   SignIn(email: string, password: string) {

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
   SignOut() {
     this.angularFireAuth.auth.signOut().then(() => {
      localStorage.setItem('user', null);
      this.router.navigate(['/login']);
      this.user = null;
      console.log('signout Success'); });
      const currentUser = this.angularFireAuth.auth.currentUser;
      console.log('currentUser', currentUser);

      if (!currentUser) {
        this.router.navigate(['/login']);
      } else {
        // No user is signed in.
      }


  }

  CheckAuthan(){
    this.angularFireAuth.auth.onAuthStateChanged( (user) => {
      console.log('signed in user', user);

      if (user) {
        // User is signed in.
        console.log('CheckAuthan IF');
        this.router.navigate(['/dashboard']);
      } else {
        // No user is signed in.
        // window.location.assign('login')
        this.router.navigate(['/login']);
        console.log('CheckAuthan ELSE');
      }
    });
  }
}

