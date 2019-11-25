import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { InterfaceAbout, ErrorMsg } from 'src/app/interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public aboutPage: FormGroup;
  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.aboutPage = this.formBuilder.group({
      title: new FormControl(null , [Validators.required]),
      description: new FormControl(null , [Validators.required])
    });
  }

  test(data: InterfaceAbout): void {
    data = {};
    data.descripttion = 'To connect firebase';
    data.name = 'I,m sirmerfang';

    console.log('AboutComponent', data);

    this.firebaseService.createDB(data);
  }

  validatorAbout(){
    if(this.aboutPage.controls.title.invalid){
      return true;
    }else{
      return false;
    }
  }
}
