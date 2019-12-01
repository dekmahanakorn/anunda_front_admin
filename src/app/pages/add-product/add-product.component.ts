import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CreateService } from 'src/app/shared/create.service';
import { Create } from 'src/app/shared/create.model';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {


  list: Create[];

  constructor(private service: CreateService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.resetForm();

    this.service.getCreates().subscribe(actionArray => {
      this.list = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Create;
      })
    });

  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      Name: '',
      Price: '',
      Size: '',
      Description: '',
    }
  }

  onSubmit(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.collection('creates').add(data);
    else
      console.log(form.value.id);

      this.firestore.doc('creates/' + form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('Submitted successfully', 'Create is done');
  }

  onEdit(emp: Create) {
    this.service.formData = Object.assign({}, emp);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.firestore.doc('creates/' + id).delete();
      this.toastr.warning('Deleted successfully', 'Delete is done');
    }
  }


}
