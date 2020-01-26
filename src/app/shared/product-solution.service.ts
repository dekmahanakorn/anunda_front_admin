import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { ProductSolution } from './product-solution.model';
import { Youtube } from './youtube.model';
import { ProductSpec } from './product-spec.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSolutionService {
  formData: ProductSolution;
  formDataYoutube: Youtube;
  formDataSpec: ProductSpec;

  constructor(private firestore: AngularFirestore) { }

  getCreates() {
    return this.firestore.collection('product-solution').snapshotChanges();
  }

  getCategory() {
    return this.firestore.collection('category').snapshotChanges();
  }
}
