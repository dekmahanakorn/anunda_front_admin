import { Component, OnInit } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { NgxPicaService } from 'ngx-pica';
import { IntroProfile } from 'src/app/shared/intro-profile.model';
import { IntroProfileService } from 'src/app/shared/intro-profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  list: IntroProfile[];

  isHovering: boolean;
  isSubmitted: boolean;
  files: File;
  selectedImage: any = null;
  closeResult: string;
  profileId: string;

  isHidden: boolean = false;
  data: any;

  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private service: IntroProfileService,
    private ngxPicaService: NgxPicaService) { }

  ngOnInit() {
    this.resetForm();
    this.getData();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      image_url: '',
    }
    this.selectedImage = null;
  }

  getData() {
    this.service.getCreates().subscribe(actionArray => {
      this.list = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as IntroProfile;
      })
    });
  }

  onSubmitUploadImage(form: NgForm) {
    this.isSubmitted = true;
    if (this.selectedImage != null) {
      this.isSubmitted = false;
      this.selectedImage = this.files[0];
      this.startUpload(this.files, form);
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(file: File) {
    this.files = file[0];
    var inner = this;
    this.ngxPicaService.resizeImage(this.files, 1280, 720)
      .subscribe((imageResized: File) => {
        inner.files = imageResized;
      });
    this.selectedImage = this.files.name;
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.db.doc('profile/' + id).delete();
      this.toastr.warning('Deleted successfully', 'Delete is done');
    }
  }

  startUpload(file: File, form: NgForm) {

    // The storage path
    const path = `profile/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        form.value.image_url = this.downloadURL;
        let data = Object.assign({}, form.value);
        delete data.id;
        if (form.value.id == null) {
          this.db.collection('profile').add(data);
        }
        else {
          this.db.doc('profile/' + form.value.id).update(data);
        }
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Add new profile is done');
      }),
    );
  }
}