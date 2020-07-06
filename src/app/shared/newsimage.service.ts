import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { NewsImage } from './newsimage.model';

@Injectable({
  providedIn: 'root'
})
export class NewsImageService {
  formData: NewsImage;

  constructor(private firestore: AngularFirestore) { }

  getNewsImage() {
    return this.firestore.collection('newsimage').snapshotChanges();
  }
}
