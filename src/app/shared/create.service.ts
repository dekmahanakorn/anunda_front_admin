import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Create } from './create.model';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  formData: Create;

  constructor(private firestore: AngularFirestore) { }

  getCreates() {
    return this.firestore.collection('product').snapshotChanges();
  }
}
