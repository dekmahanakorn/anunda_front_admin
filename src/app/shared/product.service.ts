import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { Youtube } from './youtube.model';
import { ProductSpec } from './product-spec.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  formData: Product;
  formDataYoutube: Youtube;
  formDataSpec: ProductSpec;

  constructor(private firestore: AngularFirestore) { }

  getProducts() {
    return this.firestore.collection('product').snapshotChanges();
  }
  getCategory() {
    return this.firestore.collection('category').snapshotChanges();
  }
  getProduct_Spec() {
    return this.firestore.collection('product-spec').snapshotChanges();
  }
}
