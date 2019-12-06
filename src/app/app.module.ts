import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { environment } from 'src/environments/environment';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

/* Firebase services */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

/* Firebase Auth service :  Run command for create file --> "ng g s shared/Authentication --spec=false" */
import { AuthenticationService } from './shared/authentication.service';

import { ProductService } from './shared/product.service';
import { UploaderComponent } from './pages/uploader/uploader.component';
import { UploadTaskComponent } from './pages/upload-task/upload-task.component';
import { DropzoneDirective } from './dropzone.directive';
import { AddProductCategoryComponent } from './pages/add-product-category/add-product-category.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { AddProductSolutionComponent } from './pages/add-product-solution/add-product-solution.component';
// import { AboutComponent } from './pages/about/about.component';




@NgModule({
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,

    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DropzoneDirective,
    //AddProductSolutionComponent,
    //PartnerComponent,
    //AddProductCategoryComponent,
    // UploaderComponent,
    // UploadTaskComponent,
    // AboutComponent,

  ],
  providers: [AuthenticationService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
