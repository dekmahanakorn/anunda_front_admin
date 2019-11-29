import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CreateService } from './create.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public authenticationService: AuthenticationService,
    private service: CreateService,
    private firestore: AngularFirestore) { }

    createDB(data: any, collection: string){
      this.firestore.collection(collection).add(data);
    }
    // updateDB(data: any, fromID: any){
    //   data= {};
    //   this.firestore.doc('Aboute' + fromID).valueChanges(data);
    // }
}
