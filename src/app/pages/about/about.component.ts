import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { InterfaceAbout } from 'src/app/interface/interfaceAbout';
import { ErrorMsg , AlertMsg} from 'src/app/interface/error-msg.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public aboutPage: FormGroup;
  public error = ErrorMsg;
  public alert = AlertMsg;
  public checkTitle: boolean;
  public checkDescription: boolean;
  constructor(private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }



  ngOnInit() {
    this.aboutPage = this.formBuilder.group({
      title: new FormControl(null , [Validators.required]),
      description: new FormControl(null , [Validators.required])
    });
  }

  submit(): void {
    let data: InterfaceAbout;
    data = {};
    data.id = null;
    data.image = null;
    data.descripttion = this.aboutPage.controls.description.value;
    data.name = this.aboutPage.controls.title.value;

    console.log('AboutComponent', data);
    if(this.aboutPage.valid){
      this.firebaseService.createDB(data, 'About');
      this.toastr.success(this.alert.success);

      this.aboutPage.controls.title.setValue(null);
      this.aboutPage.controls.description.setValue(null);

    }else{
      this.toastr.error(this.alert.IncerrentTryAgain);
    }
  }

  validatorAboutTitle() {

    if ( this.aboutPage.controls.title.invalid) {
      if ( this.aboutPage.controls.title.errors.required) {
        return this.checkTitle = true;
      } else {
        return this.checkTitle = false; }
    }
  }

  validatorAboutDescription() {

    if ( this.aboutPage.controls.title.invalid) {
      if ( this.aboutPage.controls.description.errors.required) {
        return this.checkDescription = true;
      } else {
        return this.checkDescription = false; }
    }
  }
}
