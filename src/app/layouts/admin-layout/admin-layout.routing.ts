import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AddProductComponent } from 'src/app/pages/add-product/add-product.component';
import { AboutComponent } from 'src/app/pages/about/about.component';
import { AddProductCategoryComponent } from 'src/app/pages/add-product-category/add-product-category.component';
import { PartnerComponent } from 'src/app/pages/partner/partner.component';
import { AddProductSolutionComponent } from 'src/app/pages/add-product-solution/add-product-solution.component';

export const AdminLayoutRoutes: Routes = [
<<<<<<<
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'add-Product',    component: AddProductComponent },
    { path: 'edit-Product',   component: EditProductComponent },
    { path: 'About',          component: AboutComponent },
    { path: 'Contact',        component: ContactComponent },

=======
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'add-Product', component: AddProductComponent },
    { path: 'About', component: AboutComponent },
    { path: 'product-category', component: AddProductCategoryComponent },
    { path: 'partner', component: PartnerComponent },
    { path: 'add-product-solution', component: AddProductSolutionComponent }
>>>>>>>
];
