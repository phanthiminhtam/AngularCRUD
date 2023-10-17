import { ShareDataService } from './../service/share-data.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
// import { Apartment } from 'src/domain/apartment';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Resident } from 'src/domain/resident';
import { Apartment } from 'src/domain/apartment';



@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.css'],
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class ResidentComponent {

  host_api: string = "https://localhost:7123/api/";
  constructor(private shareData:ShareDataService,private datePipe: DatePipe, private http:HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService){}
  residentDialog: boolean = false;
  residentDialog2:boolean = false;
  residents!: Resident[];

  apartments!: Apartment[];
  resident!: Resident;
  residentDetail: Resident = {};
  selectedApartments: any[]=[];
  selectedResidents!: Resident[] | null;

  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;

  submitted: boolean = false;
  ngOnInit() {
    this.getResidents();

    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);
    this.shareData.setSharedData({permissions:listPermission, tab: 'resident'})
    if( listPermission.includes("Admin"))
    {
       this.showbtCreate=true;
       this.showbtDelete=true;
       this.showbtEdit = true;
    }else{
    listPermission.forEach((permission:any) => {
        if(permission === "Resident_Create"){
            this.showbtCreate = true;
        }else if(permission === "Resident_Update"){
          this.showbtEdit = true;
        }else if(permission === "Resident_Delete"){
          this.showbtDelete = true;
        }
    })};
  }
  getResidents() {
    debugger;
      this.http.get<any[]>(this.host_api+ 'Resident/Resident_getall').subscribe(
          (result) => {
              this.residents = result;
          },
          (error) => {
              console.error('Error fetching customers:', error);
          }
      );
      this.http.get<any[]>(this.host_api+ 'Apartment/Apartment_getall').subscribe(
        (result) => {
            this.apartments = result;
        },
        (error) => {
            console.error('Error fetching customers:', error);
        }
    );
  }

openNew() {
    this.resident = {};
    this.submitted = false;
    this.residentDialog = true;
}



editResident(resident: Resident) {
    this.http.get(this.host_api+ "Resident/Resident_getbyid/"+resident.ResidentId).subscribe(
      (data:any)=>{
        this.selectedApartments = this.apartments.filter((val)=>data.ResidentApartments.includes(val.ApartmentId))
        this.resident= data
        if (typeof this.resident.DateOfBirth === 'string' && Date.parse(this.resident.DateOfBirth)) {
          this.resident.DateOfBirth = new Date(this.resident.DateOfBirth);
        }
        this.residentDialog = true;
      }
    )
}




deleteResident(resident: Resident){
  debugger;
  if(confirm(`Bạn có muốn xóa cư dân ${resident.Name} không?`)){
        this.http.delete<any>(this.host_api+ 'Resident/Resident_delete/' + resident.ResidentId).subscribe(
          data => {
            const index = this.residents.indexOf(resident);
            if (index !== -1) {
              this.residents.splice(index, 1);
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment Deleted', life: 3000 });
          },
          (error) => {
              console.error('Error fetching apartment:', error);
          }
      );

  };
}

hideDialog() {
    this.residentDialog = false;
    this.submitted = false;
}

saveResident() {
    this.submitted = true;
    debugger;
    if ( this.resident.Name?.trim() && this.resident.Cccd?.trim() && this.resident.PhoneNumber?.trim()&&this.resident.Email?.trim()&& this.resident.Address?.trim()) {

        if (this.resident.ResidentId) {
              if(this.selectedApartments){
                this.resident.ResidentApartments = this.selectedApartments.map(apartment => {
                  return {
                    ResidentId: this.resident.ResidentId,
                    ApartmentId: apartment.ApartmentId
                  }})
              }
              const url = this.host_api + 'Resident/Resident_update/' + this.resident.ResidentId;
              this.http.put(url,this.resident).subscribe(
              data=>{
                if(this.resident){
                  let index = this.residents.findIndex(item=>item.ResidentId==this.resident.ResidentId)
                  this.residents[index] = this.resident;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'resident updated', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                this.residents = [...this.residents];
                this.residentDialog = false;
                this.resident = {};
              }
            )
          } else {
            if(this.selectedApartments){
              this.resident.ResidentApartments = this.selectedApartments.map(apartment => {
                return {
                  ApartmentId: apartment.ApartmentId
                }})
            }
            this.http.post(this.host_api + "Resident/Resident_Create",this.resident).subscribe(
              (result:any)=>{
                if(result){
                  this.resident.ResidentId = result.id;
                  this.residents.unshift(this.resident);
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'resident created', life: 3000 });
                }
                else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                }
                this.residents = [...this.residents];
                this.residentDialog = false;
                this.resident = {};
              }
            )
        }
      }
    }

    detailResident(resident:Resident) {
      debugger;
      // this.residentDetail.Name = "Test Name";
      // this.residentDetail.PhoneNumber = "123456789";
      // this.residentDialog2 = true;
      this.http.get(this.host_api+ "Resident/GetDetail/"+resident.ResidentId).subscribe(

        (data:any)=>{
          this.residentDetail = data[0];
          // this.cdr.detectChanges();
          if (typeof this.residentDetail.DateOfBirth === 'string' && Date.parse(this.residentDetail.DateOfBirth)) {
            this.residentDetail.DateOfBirth = new Date(this.residentDetail.DateOfBirth);
          }
          this.residentDialog2 = true;
        }
      )

    }
}
