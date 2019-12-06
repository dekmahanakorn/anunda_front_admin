import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  formData: Product;

  constructor(private firestore: AngularFirestore) { }

  getProducts() {
    return this.firestore.collection('product').snapshotChanges();
  }
  getCategory() {
    return this.firestore.collection('category').snapshotChanges();
  }
}