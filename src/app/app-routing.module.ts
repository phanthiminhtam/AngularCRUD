
import { UserComponent } from './user/user.component';
import { ProductComponent } from './product/product.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { CustomerComponent } from './customer/customer.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { ResidentComponent } from './resident/resident.component';
import { PermissionComponent } from './permission/permission.component';
import { AddressComponent } from './address/address.component';
import { BuildingcategoryComponent } from './buildingcategory/buildingcategory.component';
import { UrbanareaComponent } from './urbanarea/urbanarea.component';

const routes: Routes = [
  {path: 'product', component: ProductComponent },
  {path: 'student', component: StudentComponent },
  {path:'customer', component: CustomerComponent},
  {path:'login', component: LoginComponent},
  {path:'home', component: HomeComponent},
  {path:'apartment',component:ApartmentComponent, canActivate:[authGuard],data:{requiredRole:'Apartment_GetAll'}},
  {path:'resident',component:ResidentComponent,canActivate:[authGuard],data:{requiredRole: 'Resident_GetAll'}},
  {path:'permission', component:PermissionComponent},
  {path:'user',component:UserComponent},

  {path:'urbanarea', component:UrbanareaComponent,canActivate:[authGuard],data:{requiredRole:'UrbanArea_GetAll'}},
  {path:'address', component:AddressComponent,canActivate:[authGuard],data:{requiredRole:'Address_GetAll'}},
  {path:'buildingcategory', component:BuildingcategoryComponent,canActivate:[authGuard],data:{requiredRole:'BuildingCategory_GetAll'}}


  // ,canActivate:[authGuard],data:{requiredRole: 'User_GetAll'}
  // ,canActivate:[authGuard],data:{requiredRole: 'Permission_GetAll'}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
