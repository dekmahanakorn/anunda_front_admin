import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Register } from 'src/app/shared/register.model';
import { RegisterService } from 'src/app/shared/register.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

/*   listRegister: Register[]; */
  listRegister_some_sa: Array<Register> = [];
  listRegister_some_a: Array<Register> = [];
  listRegister_some_u: Array<Register> = [];

  registerId: string;
  data: any;
  someData_sa: any
  someData_a: any
  someData_u: any

  constructor(public authenticationService: AuthenticationService,
    private service: RegisterService,
    private toastr: ToastrService,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.resetForm();
  /*   this.getRegister(); */
    this.getSomeData();

  }

  /*  signUp(form: NgForm) {
     this.authenticationService.SignUp(this.email, this.password);
     this.email = '';
     this.password = '';
   } */

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      name: '',
      email: '',
      password: '',
      status: '',
      type: '',
      uid: ''
    }
  }

/*   getRegister() {
    this.service.getRegister().subscribe(actionArray => {
      this.listRegister = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Register;
      })
    });
  } */

  getSomeData() {
    var inner = this;
    this.firestore.collection("register").get().subscribe(function (query) {
      query.forEach(function (doc) {

        if (doc.data().status == 'sa') {
          inner.someData_sa = Object.assign({}, doc.data());
          inner.listRegister_some_sa.push(inner.someData_sa);

        }
        if (doc.data().status == 'a') {
          inner.someData_a = Object.assign({}, doc.data());
          inner.listRegister_some_a.push(inner.someData_a);

        }
        if (doc.data().status == 'u') {
          inner.someData_u = Object.assign({}, doc.data());
          inner.listRegister_some_u.push(inner.someData_u);

        }


      })
    })
  }

  /* onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.firestore.doc('register/' + id).delete();
      this.toastr.warning('Deleted successfully', 'Delete is done');
    }
  } */

  signUp(form: NgForm) {

    let data = Object.assign({}, form.value);
    this.authenticationService.SignUp(data.email, data.password, form);
  }

}
