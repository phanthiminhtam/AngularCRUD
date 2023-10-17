import { Component, OnInit } from '@angular/core';
import { Address } from 'src/domain/address';
import { MessageService,ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareDataService } from '../service/share-data.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AddressComponent implements OnInit {
  constructor( private shareData:ShareDataService,private http:HttpClient,private messageService: MessageService, private confirmationService: ConfirmationService  ){}
  address_list!: Address[];
  addressDialog: boolean=false;
  selectedAddress: Address[]|null;
  address!: Address;
  submitted: boolean=false;
  host_api: string = "https://localhost:7123/api/";

  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMulti: boolean=false;
  ngOnInit() {

    this.getAddress();
    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);
    this.shareData.setSharedData({permissions:listPermission, tab: 'address'})


    if( listPermission.includes("Admin"))
    {
        this.showbtCreate=true;
        this.showbtDelete=true;
        this.showbtEdit = true;
        this.showbtDeleteMulti = true;
    }else{
      listPermission.forEach((address:any) => {
        if(address === "Addresse_Create" ){
            this.showbtCreate = true;
        }else if(address === "Addresse_Update" ){
          this.showbtEdit = true;
        }else if(address === "Addresse_Delete" ){
          this.showbtDelete = true;
        }
        else if(address==="Addresse_DeleteMultiple"){
          this.showbtDeleteMulti = true;
      }
      });
    }
  }
  hideDialog() {
    this.addressDialog = false;
    this.submitted = false;
  }
  getAddress() {
    debugger;
      this.http.get<any[]>(this.host_api+ 'Address/GetAll').subscribe(
          (result) => {
              this.address_list = result;
          },
          (error) => {
              console.error('Error fetching customers:', error);
          }
      );
  }
openNew() {
    this.address = {};
    this.submitted = false;
    this.addressDialog = true;
}
editAddress(address: Address) {
    this.address = { ...address };
    this.addressDialog = true;
}
saveAddress() {
  this.submitted = true;
  debugger;

  if(this.address.Street?.trim() && this.address.Commune?.trim() && this.address.District?.trim() && this.address.City?.trim()){
      if(this.address.AddressId){

          this.http.post<any>(this.host_api + 'Address/Update', this.address).subscribe(
              result =>{
                let index = this.address_list.findIndex(item=>item.AddressId===this.address.AddressId)
                this.address_list[index] = this.address;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Address Updated', life: 3000 });
                this.address_list = [...this.address_list];
                this.addressDialog = false;
                this.address = {};
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
        this.http.post<any>(this.host_api+ 'Address/Create',this.address).subscribe(
          result=>{
            this.address.AddressId = result;
            this.address_list.unshift(this.address);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Address Created', life: 3000 });
            this.address_list = [...this.address_list];
            this.addressDialog = false;
            this.address = {};
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
  deleteAddress(address: Address){
    debugger;
    if(confirm(`Bạn có muốn xóa địa chỉ ${address.Street},${address.Commune},${address.District},${address.City } không?`)){
          this.http.get<any>(this.host_api+ 'Address/Delete/' + address.AddressId).subscribe(
            data => {
              const index = this.address_list.indexOf(address);
              if (index !== -1) {
                this.address_list.splice(index, 1);
              }
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Adress Deleted', life: 3000 });
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
  deleteSelectedAddress() {
    if(confirm(`Bạn có muốn xóa danh sách địa chỉ không?`)){
    this.http.post<any>(this.host_api+"Address/DeleteMultiple",this.selectedAddress).subscribe(
      data=>{
        if(data== true){
          this.address_list = this.address_list.filter((val) => !this.selectedAddress?.includes(val));
          this.selectedAddress = null;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'address_list Deleted', life: 3000 });
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
        }
      }
    )
  }}
}
