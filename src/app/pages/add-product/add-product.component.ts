import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/shared/product.service';
import { Product } from 'src/app/shared/product.model';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Category } from 'src/app/shared/category.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import getYouTubeID from 'get-youtube-id';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  list: Product[];
  listCate: Category[];

  isHovering: boolean;
  isSubmitted: boolean;
  files: File;
  selectedImage: any = null;
  closeResult: string;
  productSolutionVideoId: string;
  productId: string;
  idView: string;

  player: YT.Player;

  isHidden: boolean = false;
  data: any;

  constructor(private modalService: NgbModal,
    private service: ProductService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.resetForm();
    this.getCategory();

    this.service.getProducts().subscribe(actionArray => {
      this.list = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Product;
      })
    });
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      category_id: null,
      Name: '',
      Price: '',
      Size: '',
      image_url: '',
      Description: '',
    }
  }

  getCategory() {
    this.service.getCategory().subscribe(actionArray => {
      this.listCate = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Category;
      })
    })
  }

  onSubmit(form: NgForm) {
    if (form.value.category_id == null) {
      this.toastr.error('Please select category !!!');
    } else {
      this.isSubmitted = true;
      if (this.selectedImage != null) {
        this.isSubmitted = false;
        this.selectedImage = this.files[0];
        this.startUpload(this.files, form);
      }
    }
  }

  onEdit(emp: Product) {
    this.service.formData = Object.assign({}, emp);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.firestore.doc('product/' + id).delete();
      this.toastr.warning('Deleted successfully', 'Delete is done');
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(file: File) {
    this.files = file[0];
    this.selectedImage = this.files.name;
  }

  startUpload(file: File, form: NgForm) {

    // The storage path
    const path = `product/${Date.now()}_${file.name}`;

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

        // this.firestore.collection('files').add({ downloadURL: this.downloadURL, path });

        form.value.image_url = this.downloadURL;
        let data = Object.assign({}, form.value);
        delete data.id;
        if (form.value.id == null) {
          this.firestore.collection('product').add(data);
        }
        else {
          this.firestore.doc('product/' + form.value.id).update(data);
        }
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Add new product is done');
      }),
    );
  }
}
