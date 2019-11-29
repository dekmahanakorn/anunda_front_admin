import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { ErrorMsg, AlertMsg } from 'src/app/interface/error-msg.enum';
  import { InterfaceContact } from 'src/app/interface/interfaceContact';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public contactPage: FormGroup;
  public interfaceContact: InterfaceContact;
  public error = ErrorMsg;
  public alert = AlertMsg;
  public checkAddress1: boolean;
  public checkAddress2: boolean;
  public checkTel: { required: boolean, pattern: boolean };
  public checkEmail: { required: boolean, pattern: boolean };

  constructor(private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.checkTel = { 'required': false, 'pattern': false };
    this.checkEmail = { 'required': false, 'pattern': false };

    this.contactPage = this.formBuilder.group({
      address1: new FormControl(null, [Validators.required]),
      address2: new FormControl(null, [Validators.required]),
      tel: new FormControl(null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  validateAddress1() {
    if (this.contactPage.invalid) {
      if (this.contactPage.controls.address1.errors.required) {

        return this.checkAddress1 = true;
      } else {
        return this.checkAddress1 = false;
      }
    }
  }

  validateAddress2() {
    if (this.contactPage.invalid) {
      if (this.contactPage.controls.address2.errors.required) {
        return this.checkAddress2 = true;
      } else {
        return this.checkAddress2 = false;
      }

    }
  }

  validateTel() {
    if (this.contactPage.controls.tel.errors) {
      console.log('this.contactPage.controls.tel.errors.', this.contactPage.controls.tel.errors);

      if (this.contactPage.controls.tel.errors.required) {

        this.checkTel.pattern = false;
        return this.checkTel.required = true;
      } if (this.contactPage.controls.tel.errors.pattern) {
        this.checkTel.required = false;
        return this.checkTel.pattern = true;
      } else {
        this.checkTel.required = false;
        this.checkTel.pattern = false;
        return false;
      }
    }
  }

  validateEmail() {

    if (this.contactPage.invalid) {
      console.log('this.contactPage.controls.email', this.contactPage.controls.email.errors);

      if (this.contactPage.controls.email.errors.required) {
        this.checkEmail.pattern = false;
        return this.checkEmail.required = true;
      } if (this.contactPage.controls.email.errors.email) {
        this.checkEmail.required = false;
        return this.checkEmail.pattern = true;
      } else {
        this.checkEmail.required = false;
        this.checkEmail.pattern = false;
        return false;
      }
    }
  }

  submit() {
    let contactPage = this.contactPage.controls;
    this.interfaceContact = {};
    this.interfaceContact.id = null;
    this.interfaceContact.address1 = contactPage.address1.value;
    this.interfaceContact.address2 = contactPage.address2.value;
    this.interfaceContact.tel = contactPage.tel.value;
    this.interfaceContact.email = contactPage.email.value;

    if ( contactPage.valid) {
      this.firebaseService.createDB(this.interfaceContact, 'Contact');
      this.toastr.success(this.alert.success);
    }else{
      this.toastr.error(this.alert.IncerrentTryAgain);
    }

  }



}
