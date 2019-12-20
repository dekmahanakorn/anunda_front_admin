import { Component, OnInit } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ProductSolution } from 'src/app/shared/product-solution.model';
import { ProductSolutionService } from 'src/app/shared/product-solution.service';
import { Category } from 'src/app/shared/category.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import getYouTubeID from 'get-youtube-id';

@Component({
  selector: 'app-add-product-solution',
  templateUrl: './add-product-solution.component.html',
  styleUrls: ['./add-product-solution.component.scss']
})
export class AddProductSolutionComponent implements OnInit {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  list: ProductSolution[];
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
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private service: ProductSolutionService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.resetForm();
    this.resetFormModal();
    this.getData();
    this.getCategory();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      category_id: null,
      name: '',
      image_url: '',
      price: '',
      size: '',
      description: '',
    }
    this.selectedImage = null;
  }

  resetFormModal(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formDataYoutube = {
      id: null,
      product_id: null,
      url: '',
    }
    this.isHidden = false;
    this.data = null;
    this.productSolutionVideoId = "";
    this.idView = "";
    this.selectedImage = null;
    this.modalService.dismissAll;
  }

  getData() {
    this.service.getCreates().subscribe(actionArray => {
      this.list = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as ProductSolution;
      })
    });
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

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  
  clearData() {
    this.resetForm();
  }

  onDrop(file: File) {
    this.files = file[0];
    this.selectedImage = this.files.name;
  }

  onEdit(data: ProductSolution) {
    this.service.formData = Object.assign({}, data);
  }

  onDelete(id: string) {
    var inner = this;
    this.db.collection("product-solution-video").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productSolutionVideoId = doc.id;
        }
      })
    })
    if (confirm("Are you sure to delete this record?")) {
      setTimeout(function () {
        if (this.productSolutionVideoId == "") {
          this.db.doc('product-solution/' + id).delete();
          this.toastr.warning('Deleted successfully');
        } else {
          this.db.doc('product-solution/' + id).delete();
          this.db.doc('product-solution-video/' + this.productSolutionVideoId).delete();
          this.toastr.warning('Deleted successfully');
        }
      }.bind(this), 1000);
    }
  }

  startUpload(file: File, form: NgForm) {
    // The storage path
    const path = `product-solution/${Date.now()}_${file.name}`;

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

        this.db.collection('files').add({ downloadURL: this.downloadURL, path });

        form.value.image_url = this.downloadURL;
        let data = Object.assign({}, form.value);
        delete data.id;
        if (form.value.id == null) {
          this.db.collection('product-solution').add(data);
        }
        else {
          this.db.doc('product-solution/' + form.value.id).update(data);
        }
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Add new product solution is done');
      }),
    );
  }

  open1(content1, id: string) {
    var inner = this;
    this.productId = id;
    this.db.collection("product-solution-video").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productSolutionVideoId = doc.id;
          inner.idView = getYouTubeID(doc.data().url);
          inner.data = Object.assign({}, doc.data());
        }
      })
    })

    this.modalService.open(content1, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.resetFormModal();
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  savePlayer(player) {
    this.player = player;
    //console.log('Video url: ', player.getVideoUrl());
  }

  onStateChange(event) {
    //console.log('player state', event.data);
  }

  onSubmitYoutube(form: NgForm) {
    if (form.value.url == "") {
      this.toastr.error('This field is required');
    } else {
      if (this.productSolutionVideoId != "") {
        let data = Object.assign({}, this.data);
        data.url = form.value.url;
        this.db.doc('product-solution-video/' + this.productSolutionVideoId).update(data);
        this.toastr.success('Submitted successfully', 'Update is done');
        this.modalService.dismissAll();
      } else {
        let data = Object.assign({}, form.value);
        data.product_id = this.productId;
        this.db.collection('product-solution-video').add(data);
        this.toastr.success('Submitted successfully', 'Create is done');
        this.modalService.dismissAll();
      }
    }
  }

  onPreview() {
    if (this.idView != "") {
      this.isHidden = true;
      setTimeout(function () {
        this.isHidden = false;
      }.bind(this), 60000);
    } else {
      this.toastr.error('url not found');
    }
  }
}
