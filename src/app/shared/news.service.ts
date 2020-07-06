import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { News } from './news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  formData: News;

  constructor(private firestore: AngularFirestore) { }

  getNews() {
    return this.firestore.collection('news').snapshotChanges();
  }

  updateNews(data: any, collection: string, id: string){
    this.firestore.doc(`${collection}/${id}`).update(data);

  }
}
