import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { InterfaceAbout } from 'src/app/interface/interfaceAbout';
import { ErrorMsg, AlertMsg } from 'src/app/interface/error-msg.enum';
import { ToastrService } from 'ngx-toastr';
import { CollectionDatabase } from 'src/app/interface/collection-database';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public aboutPage: FormGroup;
  public interfaceAbout: InterfaceAbout;
  public interfaceAboutList: InterfaceAbout[];
  public error = ErrorMsg;
  public alert = AlertMsg;
  public checkTitle: boolean;
  public checkDescription: boolean;
  constructor(private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }



  ngOnInit() {

    this.interfaceAbout = {};
    this.firebaseService.getAllData(CollectionDatabase.about).subscribe(actionArray => {
      console.log('actionArray', actionArray);
      this.interfaceAboutList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as InterfaceAbout;
      });
    });

    this.aboutPage = this.formBuilder.group({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
  }

  submit(): void {

    this.interfaceAbout.name =         this.aboutPage.controls.title.value;
    this.interfaceAbout.descripttion = this.aboutPage.controls.description.value;


    if (this.aboutPage.valid && !this.interfaceAbout.id) {
      // this.firebaseService.createDb(data, CollectionDatabase.about);
      this.firebaseService.createDbAddDoc(this.interfaceAbout, CollectionDatabase.about, this.interfaceAbout.id);
      console.log('Crate', this.aboutPage.valid,  this.interfaceAbout.id);
      this.aboutPage.controls.title.setValue(null);
      this.aboutPage.controls.description.setValue(null);
      this.interfaceAbout.id = null;
      this.toastr.success(this.alert.success);

    } else if (this.aboutPage.valid && this.interfaceAbout.id){
      console.log('Update', this.aboutPage.valid,  this.interfaceAbout);
      this.interfaceAbout.name = this.aboutPage.controls.title.value;
      this.interfaceAbout.descripttion = this.aboutPage.controls.description.value;
      this.firebaseService.updateDb(this.interfaceAbout, CollectionDatabase.about, this.interfaceAbout.id);
      this.aboutPage.controls.title.setValue(null);
      this.aboutPage.controls.description.setValue(null);
      this.interfaceAbout.id = null;
      this.toastr.success(this.alert.success);

    } else {
      this.toastr.error(this.alert.IncerrentTryAgain);
    }
  }

  validatorAboutTitle() {

    if (this.aboutPage.controls.title.invalid) {
      if (this.aboutPage.controls.title.errors.required) {
        return this.checkTitle = true;
      } else {
        return this.checkTitle = false;
      }
    }
  }

  validatorAboutDescription() {

    if (this.aboutPage.controls.title.invalid) {
      if (this.aboutPage.controls.description.errors.required) {
        return this.checkDescription = true;
      } else {
        return this.checkDescription = false;
      }
    }
  }

  onEdit(temp: any){
    console.log('onEdit temp', temp);

    this.interfaceAbout = temp;
    console.log(this.interfaceAbout);

    this.aboutPage.controls.title.setValue(this.interfaceAbout.name);
    this.aboutPage.controls.description.setValue(this.interfaceAbout.descripttion);

  }

  onDelete(id: string){
    if (confirm('Are you sure to delete this record?')) {
      this.firebaseService.deleteDb(CollectionDatabase.about, id);
    }
  }
}
