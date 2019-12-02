import { Component, OnInit, Input } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductSolution } from 'src/app/shared/product-solution.model';
import { ProductSolutionService } from 'src/app/shared/product-solution.service';
import { Category } from 'src/app/shared/category.model';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import getYouTubeID from 'get-youtube-id';
import { Youtube } from 'src/app/shared/youtube.model';

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
  idView: string;

  player: YT.Player;

  isHidden: boolean = false;
  data: any;

  constructor(private modalService: NgbModal, private storage: AngularFireStorage, private db: AngularFirestore, private service: ProductSolutionService,
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
    this.selectedImage = this.files.name;
  }

  onEdit(data: ProductSolution) {
    this.service.formData = Object.assign({}, data);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.db.doc('product-solution/' + id).delete();
      this.toastr.warning('Deleted successfully');
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
    console.log("form product_id" + form.value.product_id);
    console.log("form id" + form.value.id);
    console.log("form url" + form.value.url);
    if (this.productSolutionVideoId != null) {
      
      let data = Object.assign({}, this.data);
      console.log("productSolutionVideoId " + this.productSolutionVideoId);
      console.log("url " + data.url);
      console.log("product id==> " + data.product_id);
      delete data.id;
      // if (form.value.id == null)
      //   this.db.collection('product-solution-video').add(data);
      // else
      //   this.db.doc('product-solution-video/' + form.value.id).update(data);
      // this.resetFormModal(form);
      // this.toastr.success('Submitted successfully', 'Create is done');
    } else {
      this.toastr.error('This field is required');
    }
  }

  onPreview() {
    if (this.idView != "") {
      this.isHidden = true;
      setTimeout(function () {
        this.isHidden = false;
      }.bind(this), 45000);
    }else{
      this.toastr.error('url not found');
    }
  }
}
