import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { NgxPicaService } from 'ngx-pica';

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

  listCate: Category[];

  isHovering: boolean;
  isSubmitted: boolean;
  @ViewChild('image') image: ElementRef;
  files: File;
  selectedImage: any = null;
  closeResult: string;
  productSolutionVideoId: string;
  productSolutionSpecId: string;
  productId: string;
  productSpecId: string;
  idView: string;

  player: YT.Player;

  isHidden: boolean = false;
  data: any;
  dataSpec: any;

  firstInResponse: any = [];
  tableData: any[] = [];
  lastInResponse: any = [];
  prev_strt_at: any = [];
  pagination_clicked_count = 0;
  disable_next: boolean = false;
  disable_prev: boolean = false;
  data_wait: any;


  constructor(private modalService: NgbModal,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private service: ProductSolutionService,
    private toastr: ToastrService,
    private ngxPicaService: NgxPicaService) { }

  ngOnInit() {
    this.resetForm();
    this.resetFormModal();
    this.resetFormModal_spec();
    this.getCategory();
    this.loadItems();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
      this.image.nativeElement.value = null;
    this.service.formData = {
      id: null,
      category_id: null,
      name: '',
      price: '',
      size: '',
      image_url: '',
      path_img: '',
      description: '',
      timestamp: '',
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
    var inner = this;
    this.ngxPicaService.resizeImage(this.files, 800, 600)
      .subscribe((imageResized: File) => {
        inner.files = imageResized;
      });
    this.selectedImage = this.files.name;
  }

  onEdit(data: ProductSolution) {
    this.service.formData = Object.assign({}, data);
  }

  onDelete(id: string, pathIMG: string) {
    var inner = this;
    this.db.collection("product-solution-video").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productSolutionVideoId = doc.id;
        }
      })
    })
    this.db.collection("product-solution-spec").get().subscribe(function (query) {
      query.forEach(function (doc) {
        if (doc.data().product_id == id) {
          inner.productSolutionSpecId = doc.id;
        }
      })
    })
    if (confirm("Are you sure to delete this record?")) {
      setTimeout(function () {
        this.storage.ref(pathIMG).delete();
        if (this.productSolutionVideoId) {
          this.db.doc('product-solution-video/' + this.productSolutionVideoId).delete();
        }
        if (this.productSolutionSpecId) {
          this.db.doc('product-solution-spec/' + this.productSolutionSpecId).delete();
        }
        this.db.doc('product-solution/' + id).delete();
        this.toastr.warning('Deleted successfully', 'Delete is done');
      }.bind(this), 1000);
    }
  }

  startUpload(file: File, form: NgForm) {
    // The storage path
    const path = `product-solution/${Date.now()}_${form.value.name}`;

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

        //this.db.collection('files').add({ downloadURL: this.downloadURL, path });

        form.value.image_url = this.downloadURL;
        form.value.path_img = path;
        form.value.timestamp = new Date().getTime()
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



  /* -------------------------------- Model Spec Open -------------------------------------------------- */

  open2(content2, id: string) {
    var inner = this;
    this.productId = id;
    this.db.collection("product-solution-spec").get().subscribe(function (query) {
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
        this.db.doc('product-solution-spec/' + this.productSpecId).update(data);
        this.toastr.success('Submitted successfully', 'Update is done');
        this.modalService.dismissAll();
      } else {
        let data = Object.assign({}, form.value);
        data.product_id = this.productId;
        this.db.collection('product-solution-spec').add(data);
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

  /* ------------------------------------ Model Spec End ---------------------------------------------- */


  /* ---------------------------------------------------------------------------  Read Product-solution  ----------- */
  //#region Read Product

  loadItems() {
    this.db.collection('product-solution', ref => ref
      .limit(6)
      .orderBy('timestamp', 'desc')
    ).snapshotChanges()
      .subscribe(response => {
        if (!response.length) {
          console.log("No Data Available");
          return false;
        }
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
    this.db.collection('product-solution', ref => ref
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
    this.db.collection('product-solution', ref => ref
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
