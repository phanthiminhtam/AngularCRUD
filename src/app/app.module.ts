import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProductService } from 'src/service/productservice';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StudentComponent } from './student/student.component';
import { StudentService } from 'src/service/studentservice';
import { CalendarModule } from 'primeng/calendar';
import { CitizenService } from 'src/service/citizenservice';



import { CustomerComponent } from './customer/customer.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { authGuard } from './auth.guard';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_OPTIONS } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './interceptor';
import { ApartmentComponent } from './apartment/apartment.component';
import { ResidentComponent } from './resident/resident.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PermissionComponent } from './permission/permission.component';
import { UserComponent } from './user/user.component';
import { UrbanareaComponent } from './urbanarea/urbanarea.component';
import { AddressComponent } from './address/address.component';
import { BuildingcategoryComponent } from './buildingcategory/buildingcategory.component';


import { AutoCompleteModule } from 'primeng/autocomplete';
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => localStorage.getItem('token'),
    allowedDomains: ['https://localhost:7123'] // Adjust to your API domain(s)
  };
}
@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    StudentComponent,

    CustomerComponent,
     LoginComponent,
     HomeComponent,
     ApartmentComponent,
     ResidentComponent,
     PermissionComponent,
     UserComponent,
     UrbanareaComponent,
     AddressComponent,
     BuildingcategoryComponent
  ],
  imports: [

    AutoCompleteModule,
    MultiSelectModule,
    BrowserModule,
    CalendarModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    RatingModule,
    TagModule,
    DialogModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    FormsModule,
    InputTextareaModule,
    InputTextModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ],
  providers: [ProductService, StudentService, JwtHelperService,{provide: HTTP_INTERCEPTORS,useClass:Interceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
