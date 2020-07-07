import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewsService } from 'src/app/shared/news.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPicaService } from 'ngx-pica';
import { NewsImageService } from 'src/app/shared/newsimage.service';
import { Observable } from 'rxjs';
import { News } from 'src/app/shared/news.model';
import { NewsImage } from 'src/app/shared/newsimage.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  listNews: News[];
  listNewsImage: NewsImage[];

  isHovering: boolean;
  isSubmitted: boolean;
  @ViewChild('image') image: ElementRef;
  files: File;
  selectedImage: any = null;
  closeResult: string;

  idView: string;

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
  editDelete_img: string;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private service: NewsService, private serviceImage: NewsImageService, private toastr: ToastrService, private ngxPicaService: NgxPicaService) { }

  ngOnInit() {
    this.resetForm();
    this.resetFormImage();
    this.getNews();
    // this.getNewsImage();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      title: '',
      description: '',
    }
  }

  resetFormImage(form1?: NgForm) {
    if (form1 != null)
      form1.resetForm();
    this.serviceImage.formData = {
      id: null,
      image_url: '',
    }
  }


  getNews() {
    this.service.getNews().subscribe(actionArray => {
      this.listNews = actionArray.map(item => {
        console.log("id: " + item.payload.doc.id);
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as News;
      })
    })
  }

  getNewsImage() {
    this.serviceImage.getNewsImage().subscribe(actionArray => {
      this.listNewsImage = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as NewsImage;
      })
    })
  }

  onSubmitNews(form: NgForm) {
    console.log("title: " + form.value.title);
    if (form.value.title == null && form.value.description == null) {
      this.toastr.error('Please try again !!!');
    } else {

      let data = Object.assign({}, form.value);
      delete data.id;
      if (this.listNews.length == 0) {
        this.db.collection('news').add(data);
        this.resetForm(form);
        this.toastr.success('Submitted successfully', 'Add News-Service is done');
      } else {
        if (form.value.id != null) {
          this.db.doc('news/' + form.value.id).update(data);
          this.resetForm(form);
          this.toastr.success('Submitted successfully', 'Update News-Service is done');
        } else {
          this.toastr.error('Cannot insert');
          this.resetForm(form);
        }
      }
    }
  }

  clearData(){
    this.resetForm();
  }

  onEdit(data: News) {
    console.log("data id: " + data.id);
    this.service.formData = Object.assign({}, data);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.db.doc('news/' + id).delete();
      this.toastr.warning('Deleted successfully', 'Delete is done');
    }
  }

}
