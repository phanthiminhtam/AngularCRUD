import { Apartment } from './../../domain/apartment';

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
// import { Apartment } from 'src/domain/apartment';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareDataService } from '../service/share-data.service';
import { BuidingCategory } from 'src/domain/buildingcategory';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css'],
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class ApartmentComponent implements OnInit{
      buildings!: BuidingCategory[];
      apartments!: Apartment[];
      apartmentDialog: boolean=false;
      selectedApartments!: Apartment[] | null;
      apartment!: Apartment;
      submitted: boolean = false;
      host_api: string = "https://localhost:7123/api/";

      showbtCreate: boolean = false;
      showbtEdit: boolean = false;
      showbtDelete: boolean = false;
      selectedBuilding: BuidingCategory | undefined;
      constructor( private shareData:ShareDataService,private http:HttpClient,private datePipe:DatePipe, private messageService: MessageService, private confirmationService: ConfirmationService  ){}
        ngOnInit() {

        this.getApartments();
        const dataPermissions = sessionStorage.getItem('permissions')||""
        const listPermission = JSON.parse(dataPermissions);
        this.shareData.setSharedData({permissions:listPermission, tab: 'apartment'})

        if( listPermission.includes("Admin"))
       {
          this.showbtCreate=true;
          this.showbtDelete=true;
          this.showbtEdit = true;
       }else{

        listPermission.forEach((permission:any) => {
          if(permission === "Apartment_Create" ){
              this.showbtCreate = true;
          }else if(permission === "Apartment_Update" ){
            this.showbtEdit = true;
          }else if(permission === "Apartment_Delete" ){
            this.showbtDelete = true;
          }
      });
       }


     }
     hideDialog() {
      this.apartmentDialog = false;
      this.submitted = false;
    }
    getApartments() {
      debugger;
      this.http.get<any>(this.host_api+ 'BuildingCategory/GetAll').subscribe(
        (result) => {
            this.buildings = result;

        },
        (error) => {
            console.error('Error fetching permissions:', error);
        }
      );
      this.http.get<any[]>(this.host_api+ 'Apartment/GetSelect').subscribe(
        (result) => {
            this.apartments = result;
        },
        (error) => {
            console.error('Error fetching customers:', error);
        }
      );
    }


  openNew() {
      this.apartment = {};
      this.submitted = false;
      this.apartmentDialog = true;
  }
  editApartment(apartment: Apartment) {
    this.selectedBuilding = this.buildings.find(item=>item.CategoryId == apartment.CategoryId)
      this.apartment = { ...apartment };
      this.apartmentDialog = true;
  }
  saveApartment() {
    this.submitted = true;
    debugger;
    if(this.apartment.ApartmentName?.trim() && this.apartment.Building?.trim() && this.apartment.Floor && this.apartment.Space){
        if(this.apartment.ApartmentId){
            const url = this.host_api + 'Apartment/' + this.apartment.ApartmentId;
            this.apartment.CategoryId = this.selectedBuilding?.CategoryId;
            this.http.put<any>(url, this.apartment).subscribe(
                result =>{
                  this.apartment.BuildingCategory = this.selectedBuilding;
                  let index = this.apartments.findIndex(item=>item.ApartmentId===this.apartment.ApartmentId)
                  this.apartments[index] = this.apartment;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                  this.apartments = [...this.apartments];
                  this.apartmentDialog = false;
                  this.apartment = {};
                  this.selectedBuilding = {}
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 401) {

                      alert('Unauthorized access');
                  } else {
                      // Handle other errors
                      console.error('An error occurred:', error.error);
                  }
                }
            )
        }
        else{
          this.apartment.CategoryId = this.selectedBuilding?.CategoryId
          this.http.post<any>(this.host_api+ 'Apartment/Apartment_Create',this.apartment).subscribe(
            result=>{
              this.apartment.ApartmentId = result.ApartmentId
              this.apartment.BuildingCategory ={CategoryName: this.selectedBuilding?.CategoryName};
              this.apartment.BuildingCategory.UrbanArea = {UrbanName: this.selectedBuilding?.UrbanArea?.UrbanName}
              this.apartments.unshift(this.apartment);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
              this.apartments = [...this.apartments];
              this.apartmentDialog = false;
              this.apartment = {};
            },
            (error: HttpErrorResponse) => {
              if (error.status === 401) {

                  alert('Unauthorized access');
              } else {
                  // Handle other errors
                  console.error('An error occurred:', error.error);
              }
            }
          );
        }
      }
    }
    deleteApartment(apartment: Apartment){
      debugger;
      if(confirm(`Bạn có muốn xóa căn hộ ${apartment.ApartmentName} không?`)){
            this.http.delete<any>(this.host_api+ 'Apartment/' + apartment.ApartmentId).subscribe(
              data => {
                const index = this.apartments.indexOf(apartment);
                if (index !== -1) {
                  this.apartments.splice(index, 1);
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment Deleted', life: 3000 });
              },
              (error: HttpErrorResponse) => {
                if (error.status === 401) {

                    alert('Unauthorized access');
                } else {
                    // Handle other errors
                    console.error('An error occurred:', error.error);
                }
              }
          );

      };
    }
}




