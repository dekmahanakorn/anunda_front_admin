import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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

import { NgxPicaService } from 'ngx-pica';

@Component({
  selector: 'app-add-product',/*  */
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {/*  */

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  listCate: Category[];

  isHovering: boolean;
  isSubmitted: boolean;

  @ViewChild('image') image: ElementRef;
  files: File;
  files_img: File;
  selectedImage: any = null;
  selectedFile: any = null;
  closeResult: string;
  productVideoId: string;
  productSpecId: string;
  productId: string;
  idView: string;

  player: YT.Player;

  isHidden: boolean = false;
  data: any;
  dataSpec: any;

  checkShow: boolean = false;
  dataCate_id: string;
  firstInResponse: any = [];
  tableData: any[] = [];
  lastInResponse: any = [];
  prev_strt_at: any = [];
  pagination_clicked_count = 0;
  disable_next: boolean = false;
  disable_prev: boolean = false;
  data_wait: any;
  editDelete_img: string;

  constructor(private modalService: NgbModal,
    private service: ProductService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private ngxPicaService: NgxPicaService) { }

  ngOnInit() {
    this.resetForm();
    this.resetFormModal();
    this.resetFormModal_spec();
    this.getCategory();

  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.image.nativeElement.value = null;
    this.service.formData = {
      id: null,
      category_id: null,
      Name: '',
      Price: '',
      Size: '',
      image_url: '',
      path_img: '',
      Description: '',
      timestamp: '',
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

  clearData() {
    this.resetForm();
  }


  /* --------------------------------------------------------------------------------- CRUD --------------- */
  //#region Insert Form , Insert IMG , Edit , Delete 

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

  onEdit(emp: Product, pathIMG: string) {
    this.service.formData = Object.assign({}, emp);
    this.editDelete_img = pathIMG;
  }

  onDelete(id: string, pathIMG: string) {
    var inner = this;
    this.firestore.collection("product-video").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productVideoId = doc.id;
        }
      })
    })
    this.firestore.collection("product-spec").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productSpecId = doc.id;
        }
      })
    })
    if (confirm("Are you sure to delete this record?")) {
      setTimeout(function () {
        this.storage.ref(pathIMG).delete();
        if (this.productVideoId) {
          this.firestore.doc('product-video/' + this.productVideoId).delete();
        }
        if (this.productSpecId) {
          this.firestore.doc('product-spec/' + this.productSpecId).delete();
        }
        this.firestore.doc('product/' + id).delete();
        this.toastr.warning('Deleted successfully', 'Delete is done');
      }.bind(this), 1000);
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(file: File) {
    this.files = file[0];
    var inner = this;
    this.ngxPicaService.resizeImage(this.files, 800, 600)
      .subscribe((imageResized: File) => {
        inner.files = imageResized;
      });
    this.selectedImage = this.files.name;
  }

  startUpload(file: File, form: NgForm) {
    // The storage path
    const path = `product/${Date.now()}_${form.value.name}`;

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

        // this.firestore.collection('files').add({ downloadURL: this.downloadURL, path });

        form.value.image_url = this.downloadURL;
        form.value.path_img = path;
        form.value.timestamp = new Date().getTime()
        let data = Object.assign({}, form.value);
        delete data.id;
        if (form.value.id == null) {
          this.firestore.collection('product').add(data);
        }
        else {
          this.storage.ref(this.editDelete_img).delete();
          this.firestore.doc('product/' + form.value.id).update(data);
        }
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Add new product is done');
      }),
    );
  }
  //#endregion Insert Form , Insert IMG , Edit , Delete 


  /* --------------------------------------------------------------------------- Model Video Open --------- */
  //#region Model Video

  open1(content1, id: string) {
    var inner = this;
    this.productId = id;
    this.firestore.collection("product-video").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productVideoId = doc.id;
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
    this.productVideoId = "";
    this.idView = "";
    this.selectedImage = null;
    this.modalService.dismissAll;
  }

  savePlayer(player) {
    this.player = player;
    //console.log('Video url: ', player.getVideoUrl());
  }

  onSubmitYoutube(form: NgForm) {
    if (form.value.url == "") {
      this.toastr.error('This field is required');
    } else {
      if (this.productVideoId != "") {
        let data = Object.assign({}, form.value);
        data.url = form.value.url;
        this.firestore.doc('product-video/' + this.productVideoId).update(data);
        this.toastr.success('Submitted successfully', 'Update is done');
        this.modalService.dismissAll();
      } else {
        let data = Object.assign({}, form.value);
        data.product_id = this.productId;
        this.firestore.collection('product-video').add(data);
        this.toastr.success('Submitted successfully', 'Create is done');
        this.modalService.dismissAll();
      }
    }
  }

  onPreview() {
    if (this.idView != "") {
      this.isHidden = true;
      // setTimeout(function () {
      //   this.isHidden = false;
      // }.bind(this), 60000);
    } else {
      this.toastr.error('url not found');
    }
  }
  //#endregion Model Video end



  /* --------------------------------------------------------------------------- Model Spec Open ---------- */
  //#region Model Spec

  open2(content2, id: string) {
    var inner = this;
    this.productId = id;
    this.firestore.collection("product-spec").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productSpecId = doc.id;
          inner.idView = doc.data().head_1;
          inner.dataSpec = Object.assign({}, doc.data());
          /*       console.log(inner.dataSpec); */
        }
      })
    })

    this.modalService.open(content2, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.resetFormModal_spec();
    });
  }

  resetFormModal_spec(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formDataSpec = {
      id: null,
      product_id: null,
      head_1: '',
      head_2: '',
      head_3: '',
      head_4: '',
      detail_1: '',
      detail_2: '',
      detail_3: '',
      detail_4: '',
    }
    this.isHidden = false;
    this.data = null;
    this.productSpecId = "";
    this.idView = "";
    this.selectedImage = null;
    this.modalService.dismissAll;
  }

  onSubmit_spec(form: NgForm) {
    if (form.value.head_1 == "" || form.value.detail_1 == "") {
      this.toastr.error('This field is required');
    } else {
      if (this.productSpecId != "") {
        let data = Object.assign({}, form.value);
        /*   data.url = form.value.url; */
        this.firestore.doc('product-spec/' + this.productSpecId).update(data);
        this.toastr.success('Submitted successfully', 'Update is done');
        this.modalService.dismissAll();
      } else {
        let data = Object.assign({}, form.value);
        data.product_id = this.productId;
        this.firestore.collection('product-spec').add(data);
        this.toastr.success('Submitted successfully', 'Create is done');
        this.modalService.dismissAll();
      }
    }
  }

  onPreview_spec() {
    if (this.idView != "") {
      this.isHidden = true;
      // setTimeout(function () {
      //   this.isHidden = false;
      // }.bind(this), 60000);
    } else {
      this.toastr.error('not found');
    }
  }
  //#endregion Model Spec End



  /* ---------------------------------------------------------------------------  Read Product  ----------- */
  //#region Read Product

  clickShow_data(data: string) {
    var inner = this;
    this.firestore.collection("category").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().Name == data) {
          inner.dataCate_id = doc.id;
          inner.loadItems();
        }
      })
    })
  }

  loadItems() {
    this.firestore.collection('product', ref => ref
      .where("category_id", "==", this.dataCate_id)
      .limit(6)
      .orderBy('timestamp', 'desc')
    ).snapshotChanges()
      .subscribe(response => {
        if (!response.length) {
          this.toastr.error('No Data Available');
          this.tableData = [];
          this.checkShow = false;
          return false;
        }
        this.checkShow = true;
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.tableData = [];
        for (let item of response) {
          this.data_wait = item.payload.doc.data()
          this.data_wait.id = item.payload.doc.id;
          this.tableData.push(this.data_wait);
        }

        console.log('tableData : ', this.tableData);

        //Initialize values
        this.prev_strt_at = [];
        this.pagination_clicked_count = 0;
        this.disable_next = false;
        this.disable_prev = false;

        //Push first item to use for Previous action
        this.push_prev_startAt(this.firstInResponse);
      }, error => {
        console.log(error);
      });
  }

  prevPage() {
    this.disable_prev = true;
    this.firestore.collection('product', ref => ref
      .where("category_id", "==", this.dataCate_id)
      .orderBy('timestamp', 'desc')
      .startAt(this.get_prev_startAt())
      .endBefore(this.firstInResponse)
      .limit(6)
    ).get()
      .subscribe(response => {
        this.firstInResponse = response.docs[0];
        this.lastInResponse = response.docs[response.docs.length - 1];

        this.tableData = [];
        for (let item of response.docs) {
          this.data_wait = item.data();
          this.data_wait.id = item.id;
          this.tableData.push(this.data_wait);
        }

        //Maintaing page no.
        this.pagination_clicked_count--;

        //Pop not required value in array
        this.pop_prev_startAt(this.firstInResponse);

        //Enable buttons again
        this.disable_prev = false;
        this.disable_next = false;
      }, error => {
        this.disable_prev = false;
      });
  }

  nextPage() {
    this.disable_next = true;
    this.firestore.collection('product', ref => ref
      .where("category_id", "==", this.dataCate_id)
      .orderBy('timestamp', 'desc')
      .limit(6)
      .startAfter(this.lastInResponse)
    ).get()
      .subscribe(response => {

        if (!response.docs.length) {
          this.disable_next = true;
          return;
        }

        this.firstInResponse = response.docs[0];

        this.lastInResponse = response.docs[response.docs.length - 1];
        this.tableData = [];
        for (let item of response.docs) {

          this.data_wait = item.data();
          this.data_wait.id = item.id;
          this.tableData.push(this.data_wait);
        }

        this.pagination_clicked_count++;

        this.push_prev_startAt(this.firstInResponse);

        this.disable_next = false;
      }, error => {
        this.disable_next = false;
      });
  }

  push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
  }

  pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach(element => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  get_prev_startAt() {
    if (this.prev_strt_at.length > (this.pagination_clicked_count + 1))
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }
  //#endregion End Read Product




}
