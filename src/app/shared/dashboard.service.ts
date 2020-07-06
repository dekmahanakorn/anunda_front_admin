import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Dashboard } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  formData: Dashboard;

  constructor(private firestore: AngularFirestore) { }

  getData() {
    return this.firestore.collection('message').snapshotChanges();
  }
}
