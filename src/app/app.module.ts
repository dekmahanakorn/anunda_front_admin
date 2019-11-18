import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';


/* Firebase services */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

/* Firebase Auth service :  Run command for create file --> "ng g s shared/Authentication --spec=false" */
import { AuthenticationService } from './shared/authentication.service';


const firebaseConfig = {
  apiKey: 'AIzaSyDHL27PyZ6AtTT6L01JdjU_U6ju7DvT0rY',
  authDomain: 'anundatechfirstwebsite.firebaseapp.com',
  databaseURL: 'https://anundatechfirstwebsite.firebaseio.com',
  projectId: 'anundatechfirstwebsite',
  storageBucket: 'anundatechfirstwebsite.appspot.com',
  messagingSenderId: '780011251240',
  appId: '1:780011251240:web:6eee98312158e9bfd4771d',
};


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,

    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,

  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
