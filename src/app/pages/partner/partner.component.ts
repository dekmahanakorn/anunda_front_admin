import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Partner } from 'src/app/shared/partner.model';
import { PartnerService } from 'src/app/shared/partner.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { NgxPicaService } from 'ngx-pica';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  list: Partner[];

  isHovering: boolean;
  isSubmitted: boolean;
  @ViewChild('image') image: ElementRef;
  files: File;
  selectedImage: any = null;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private service: PartnerService,
    private toastr: ToastrService, private ngxPicaService: NgxPicaService) { }

  ngOnInit() {
    this.resetForm();
    this.getData();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
      this.image.nativeElement.value = null;
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
        } as Partner;
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
    this.ngxPicaService.resizeImage(this.files, 500, 180)
      .subscribe((imageResized: File) => {
        inner.files = imageResized;
      });
    this.selectedImage = this.files.name;
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.db.doc('partner/' + id).delete();
      this.toastr.warning('Deleted successfully', 'Delete is done');
    }
  }

  startUpload(file: File, form: NgForm) {

    // The storage path
    const path = `partner/` + this.selectedImage;

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
          this.db.collection('partner').add(data);
        }
        else {
          this.db.doc('partner/' + form.value.id).update(data);
        }
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Add new partner is done');
      }),
    );
  }
}
