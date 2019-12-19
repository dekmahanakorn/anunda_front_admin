import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';
import { AboutComponent } from 'src/app/pages/about/about.component';
import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { UploaderComponent } from 'src/app/pages/uploader/uploader.component';
import { UploadTaskComponent } from 'src/app/pages/upload-task/upload-task.component';
import { AddProductCategoryComponent } from 'src/app/pages/add-product-category/add-product-category.component';
import { PartnerComponent } from 'src/app/pages/partner/partner.component';
import { AddProductSolutionComponent } from 'src/app/pages/add-product-solution/add-product-solution.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';

// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    NgxYoutubePlayerModule.forRoot(),
    ClipboardModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    AddProductComponent,
    AboutComponent,
    ContactComponent,
    UploaderComponent,
    UploadTaskComponent,
    AddProductCategoryComponent,
    PartnerComponent,
    AddProductSolutionComponent,
    ProfileComponent
  ]
})

export class AdminLayoutModule {}
