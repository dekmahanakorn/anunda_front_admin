import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { InterfaceAbout } from 'src/app/interface/interfaceAbout';
import { ErrorMsg, AlertMsg } from 'src/app/interface/error-msg.enum';
import { ToastrService } from 'ngx-toastr';
import { CollectionDatabase } from 'src/app/interface/collection-database';
import { NgxPicaService } from 'ngx-pica';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

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
  isSubmitted: boolean;
  isHovering: boolean;
  
  @ViewChild('image') image: ElementRef;
  files: File;
  files_img: File;
  selectedImage: any = null;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  constructor(private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private ngxPicaService: NgxPicaService) { }

  ngOnInit() {

    this.firebaseService.getAllData(CollectionDatabase.about).subscribe(actionArray => {
      this.interfaceAboutList = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as InterfaceAbout;
      });
    });

    this.aboutPage = this.formBuilder.group({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      image: new FormControl(null),
      sub_des1: new FormControl(null),
      sub_des2: new FormControl(null),
      sub_des3: new FormControl(null)
    });
  }

  submit(): void {
    let data: InterfaceAbout;
    data = {};
    data.descripttion = this.aboutPage.controls.description.value;
    data.name = this.aboutPage.controls.title.value;
    data.sub_des1 = this.aboutPage.controls.sub_des1.value;
    data.sub_des2 = this.aboutPage.controls.sub_des2.value;
    data.sub_des3 = this.aboutPage.controls.sub_des3.value;

    this.isSubmitted = true;
    if (this.selectedImage != null && this.aboutPage.valid) {
      this.isSubmitted = false;
      this.startUpload(this.files, data);
    }
    if (this.selectedImage == null) {
      this.toastr.error('Please select image !!!');
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

  onEdit(temp: InterfaceAbout) {

    this.interfaceAbout = temp;
    this.aboutPage.controls.id.setValue(this.interfaceAbout.id);
    this.aboutPage.controls.title.setValue(this.interfaceAbout.name);
    this.aboutPage.controls.description.setValue(this.interfaceAbout.descripttion);
    this.aboutPage.controls.image.setValue(this.interfaceAbout.image);
    this.aboutPage.controls.sub_des1.setValue(this.interfaceAbout.sub_des1);
    this.aboutPage.controls.sub_des2.setValue(this.interfaceAbout.sub_des2);
    this.aboutPage.controls.sub_des3.setValue(this.interfaceAbout.sub_des3);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.firebaseService.deleteDb(CollectionDatabase.about, id);
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(file: File) {
    this.files = file[0];
    var inner = this;
    this.ngxPicaService.resizeImage(this.files, 600, 600)
      .subscribe((imageResized: File) => {
        inner.files = imageResized;
      });
    this.selectedImage = this.files.name;
  }

  startUpload(file: File, data: InterfaceAbout) {

    if (this.interfaceAboutList.length == 0) {
      // The storage path
      const path = `about/` + this.selectedImage;

      // Reference to storage bucket
      const ref = this.storage.ref(path);

      // // The main task
      this.task = this.storage.upload(path, file);

      // Progress monitoring
      this.percentage = this.task.percentageChanges();

      this.snapshot = this.task.snapshotChanges().pipe(
        tap(console.log),
        // The file's download URL
        finalize(async () => {
          this.downloadURL = await ref.getDownloadURL().toPromise();

          data.image = this.downloadURL;
          this.firebaseService.createDb(data, CollectionDatabase.about);
          this.aboutPage.controls.title.setValue(null);
          this.aboutPage.controls.description.setValue(null);
          this.aboutPage.controls.image.setValue(null);
          this.aboutPage.controls.sub_des1.setValue(null);
          this.aboutPage.controls.sub_des2.setValue(null);
          this.aboutPage.controls.sub_des3.setValue(null);
          this.image.nativeElement.value = null;
          this.toastr.success('Submitted successfully', 'Add new about is done');
        }),
      );
    } else if (this.interfaceAboutList.length == 1) {
      if (this.aboutPage.controls.id.value != null) {
        // The storage path
        const path = `about/` + this.selectedImage;

        // Reference to storage bucket
        const ref = this.storage.ref(path);

        // // The main task
        this.task = this.storage.upload(path, file);

        // Progress monitoring
        this.percentage = this.task.percentageChanges();

        this.snapshot = this.task.snapshotChanges().pipe(
          tap(console.log),
          // The file's download URL
          finalize(async () => {
            this.downloadURL = await ref.getDownloadURL().toPromise();

            this.aboutPage.controls.image.setValue(this.downloadURL);
            this.interfaceAbout.name = this.aboutPage.controls.title.value;
            this.interfaceAbout.descripttion = this.aboutPage.controls.description.value;
            this.interfaceAbout.image = this.aboutPage.controls.image.value;
            this.interfaceAbout.sub_des1 = this.aboutPage.controls.sub_des1.value;
            this.interfaceAbout.sub_des2 = this.aboutPage.controls.sub_des2.value;
            this.interfaceAbout.sub_des3 = this.aboutPage.controls.sub_des3.value;
            this.firebaseService.updateDb(this.interfaceAbout, CollectionDatabase.about, this.interfaceAbout.id);
            this.image.nativeElement.value = null;
            this.toastr.success('Submitted successfully', 'Update about is done');
          }),
        );
      } else {
        this.toastr.error('Cannot insert');
      }
    }
  }
}
