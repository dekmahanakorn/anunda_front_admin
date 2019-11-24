import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Partner } from './partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  formData: Partner;

  constructor(private firestore: AngularFirestore) { }

  getCreates() {
    return this.firestore.collection('partner').snapshotChanges();
  }
}
