import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { User } from 'firebase';

import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: Observable<firebase.User>;
  user: User;


  constructor(public angularFireAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private toastr: ToastrService) {
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
  async SignIn(email: string, password: string) {

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
  async SignOut() {
    await this.angularFireAuth.auth.signOut().then(() => {
      localStorage.setItem('user', null);
      this.router.navigate(['/login']);
      this.user = null;
      console.log('signout Success');
    });
  }


/*   CheckAuthan() {
    if (this.user) {
      this.router.navigate(['/Dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }  */



}

