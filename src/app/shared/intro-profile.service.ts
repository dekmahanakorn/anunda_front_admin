import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { IntroProfile } from './intro-profile.model';

@Injectable({
  providedIn: 'root'
})
export class IntroProfileService {
  formData: IntroProfile;

  constructor(private firestore: AngularFirestore) { }

  getCreates() {
    return this.firestore.collection('profile').snapshotChanges();
  }
}
