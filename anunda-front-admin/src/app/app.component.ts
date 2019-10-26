import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private db: AngularFireDatabase){}
  
  addWiki(data:NgForm){
    //console.log(data.value);
    this.db.list("/test NNN NGZ").push(data.value);
  }
}
