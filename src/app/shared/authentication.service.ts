import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { User } from 'firebase';

import { Router } from '@angular/router';
import { Register } from './register.model';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: Observable<firebase.User>;
  user: User;

  constructor(public angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private toastr: ToastrService) {

    this.userData = angularFireAuth.authState;

  }

  /* Sign up */
  SignUp(email: string, password: string, form: NgForm) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        let data = Object.assign({}, form.value);
        if (data.status == 'a') {
          data.type = 'admin'
        } else {
          data.type = 'user'
        }
        data.uid = res.user.uid;
        this.firestore.collection('register').add(data);

        this.toastr.success('Successfully signed up!', 'Create is done');
      })
      .catch(error => {
        this.toastr.error('Something is wrong:', error.message);
      });
  }

  /* Sign in */
   SignIn(email: string, password: string) {

    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
    console.log('cerrent', this.user);



    this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
      /*   this.user = this.angularFireAuth.auth.currentUser;
        console.log('Successfully signed in!');
        console.log(this.user.uid);
        console.log(this.user.email); */
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
      console.log('signout Success');
    });
  }

  CheckAuthen() {
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

  SignUpV2(form: Register) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(res => {

        if (form.status == 'a') {
          form.type = 'admin'
        } else {
          form.type = 'user'
        }
        form.uid = res.user.uid;
        this.firestore.collection('register').add(form);

        this.toastr.success('Successfully signed up!', 'Create is done',{
          timeOut: 3000
        } );
      })
      .catch(error => {
        this.toastr.error('Something is wrong:', error.message);
      });
  }

}

