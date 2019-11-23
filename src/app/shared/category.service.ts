import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  formData: Category;

  constructor(private firestore: AngularFirestore) { }

  getCreates() {
    return this.firestore.collection('category').snapshotChanges();
  }
}
