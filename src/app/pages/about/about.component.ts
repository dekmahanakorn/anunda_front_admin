import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { InterfaceAbout } from 'src/app/interface/interfaceAbout';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor( private firebaseService: FirebaseService) { }


  // private data: InterfaceAbout;

  ngOnInit() {

  }
  
  test(data: InterfaceAbout): void {
    data = {};
    data.descripttion = 'To connect firebase';
    data.name = 'I,m sirmerfang';

    console.log('AboutComponent', data);
 
    this.firebaseService.createDB(data);
  }
}
