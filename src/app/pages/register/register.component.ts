import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Register } from 'src/app/shared/register.model';
import { RegisterService } from 'src/app/shared/register.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, FormControl, Validators, } from '@angular/forms';

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
  someData_sa: any;
  someData_a: any;
  someData_u: any;
  register: FormGroup;
  fromRegister: Register = {};
  msgError: any[] = [];

  constructor(public authenticationService: AuthenticationService,
    private service: RegisterService,
    private toastr: ToastrService,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    // formControlName
    this.register = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      confPassword: new FormControl(null, [Validators.required]),

    });

    // this.resetForm();
    /*   this.getRegister(); */
    this.getSomeData();

  }

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

  getSomeData() {
    var inner = this;
    this.firestore.collection("register").get().subscribe(function (query) {
      query.forEach(function (doc) {

        if (doc.data().status === 'sa') {
          inner.someData_sa = Object.assign({}, doc.data());
          inner.listRegister_some_sa.push(inner.someData_sa);
        }
        if (doc.data().status === 'a') {
          inner.someData_a = Object.assign({}, doc.data());
          inner.listRegister_some_a.push(inner.someData_a);

        }
        if (doc.data().status === 'u') {
          inner.someData_u = Object.assign({}, doc.data());
          inner.listRegister_some_u.push(inner.someData_u);
        }
      })
    });
  }

  signUp(form: Register) {
    if(this.validateData()) {
      this.authenticationService.SignUpV2(form);

    }
  }

  validateData(): boolean {
    this.msgError = [];
    console.log('this.register',this.register);

    let validate = true;
    let pwd = this.register.controls.password.value;
    let confPwd = this.register.controls.confPassword.value;

    if (this.register.invalid) {
      validate = false;
      if (this.register.controls.name.invalid){
        this.msgError.push('Please insert Name');
      } else if (this.register.controls.status.invalid) {
        this.msgError.push('Please insert type user');
      } else if (this.register.controls.email.invalid) {
        this.msgError.push('Email incurrent');
      } else if (this.register.controls.password.invalid) {
        this.msgError.push('Please insert Password');
      } else if (this.register.controls.confPassword.invalid) {
        this.msgError.push('Please insert Confirm Password');
      }
    }
    if (pwd !== confPwd) {
      validate = false;
      this.msgError.push('Password does not match');
    }

    if(!validate) {
      this.fromRegister = {
        name: this.register.controls.name.value,
        status: this.register.controls.status.value,
        email: this.register.controls.email.value,
        password: this.register.controls.password.value,
      };
    }
    console.log(this.fromRegister);

    return validate;
  }

}
