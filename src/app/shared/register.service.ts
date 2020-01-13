import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Register } from './Register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  formData: Register;

  constructor(private firestore: AngularFirestore) { }

  getRegister() {
    return this.firestore.collection('register').snapshotChanges();
  }
}
