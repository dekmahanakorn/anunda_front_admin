import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ProductService } from './product.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public authenticationService: AuthenticationService,
    private service: ProductService,
    private firestore: AngularFirestore) { }

    createDb(data: any, collection: string){
      this.firestore.collection(collection).add(data);
    }


    updateDb(data: any, collection: string, id: string){
      this.firestore.doc(`${collection}/${id}`).update(data);

    }

    deleteDb(collection: string, id: string){
      this.firestore.doc(`${collection}/${id}`).delete();

    }


    getAllData(collection: string) {
      return this.firestore.collection(collection).snapshotChanges();
    }
}
