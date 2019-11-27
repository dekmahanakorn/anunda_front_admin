import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { ProductSolution } from './product-solution.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSolutionService {
  formData: ProductSolution;

  constructor(private firestore: AngularFirestore) { }

  getCreates() {
    return this.firestore.collection('product-solution').snapshotChanges();
  }

  getCategory(){
    return this.firestore.collection('category').snapshotChanges();
  }
  
  getProductSolutionVideo() {
    return this.firestore.collection('product-solution-video').snapshotChanges();
  }
}
