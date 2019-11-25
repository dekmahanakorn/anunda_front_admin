import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { InterfaceAbout } from 'src/app/interface/interfaceAbout';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutPage: FormGroup;
  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) { }

  // aboutPage = new FormGroup({
  //   title: new FormControl(''),
  //   description: new FormControl(''),
  // });
  // private data: InterfaceAbout;

  ngOnInit() {
      this.aboutPage = this.formBuilder.group({
        title: new FormControl(),
        description: new FormControl()
      });
  }

  test(data: InterfaceAbout): void {
    data = {};
    data.descripttion = 'To connect firebase';
    data.name = 'I,m sirmerfang';

    console.log('AboutComponent', data);

    this.firebaseService.createDB(data);
  }
}
