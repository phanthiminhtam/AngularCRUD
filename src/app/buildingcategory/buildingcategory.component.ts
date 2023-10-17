import { Component,OnInit } from '@angular/core';
import { BuidingCategory } from 'src/domain/buildingcategory';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { UrbanArea } from 'src/domain/urbanarea';
import { Address } from 'src/domain/address';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-buildingcategory',
  templateUrl: './buildingcategory.component.html',
  styleUrls: ['./buildingcategory.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class BuildingcategoryComponent {
  urbanareas!: UrbanArea[];
  address!: Address[];
  selectUrbanareas: any[]=[];
  selectAddress: Address|undefined;

  building!: BuidingCategory;
  buildings!: BuidingCategory[];
  buildingDialog: boolean = false;
  selectedBuildings!:BuidingCategory[]|null;
  submitted: boolean = false;
  host_api: string = "https://localhost:7123/api/";

  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMulti: boolean=false;

  constructor(private shareData:ShareDataService, private http:HttpClient, private messageService: MessageService){}
  ngOnInit() {
    this.getBuildings();
    const dataPermissions = sessionStorage.getItem('permissions')||""
    const listPermission = JSON.parse(dataPermissions);
    this.shareData.setSharedData({permissions:listPermission, tab: 'buildingcategory'})
    if( listPermission.includes("Admin"))
    {
       this.showbtCreate=true;
       this.showbtDelete=true;
       this.showbtEdit = true;
       this.showbtDeleteMulti = true;
    }else{
    listPermission.forEach((building:any) => {
        if(building === "BuildingCategorie_Create"){
            this.showbtCreate = true;
        }else if(building === "BuildingCategorie_Update"){
          this.showbtEdit = true;
        }else if(building === "BuildingCategorie_Delete"){
          this.showbtDelete = true;
        }
        else if(building==="BuildingCategorie_DeleteMultiple"){
           this.showbtDeleteMulti = true;
        }
    })};
  }
  hideDialog() {
    this.buildingDialog = false;
    this.submitted = false;
  }
  getBuildings() {
    debugger;

    this.http.get<any[]>(this.host_api+ 'UrbanArea/GetAll').subscribe(
      (result) => {
          this.urbanareas = result;
      },
      (error) => {
          console.error('Error fetching customers:', error);
      }
    );
    this.http.get<any[]>(this.host_api+ 'Address/GetAll').subscribe(
      (result) => {
          this.address = result;
      },
      (error) => {
          console.error('Error fetching customers:', error);
      }
    );

    this.http.get<any>(this.host_api+ 'BuildingCategory/GetAll').subscribe(
          (result) => {
              this.buildings = result;

          },
          (error) => {
              console.error('Error fetching permissions:', error);
          }
      );
    }
    openNew() {
      debugger;
      this.building = {};
      this.submitted = false;
      this.buildingDialog = true;
    }
    editBuilding(building: BuidingCategory) {
    debugger
    this.selectAddress = this.address.find(item=>item.AddressId == building.AddressId)
    this.building = building;
    this.buildingDialog = true;
  }
  saveBuilding() {
  this.submitted = true;
  if(this.building.CategoryName?.trim() && this.selectAddress && this.building.UrbanArea){
    this.building.AddressId = this.selectAddress.AddressId
    this.building.UrbanId = this.building.UrbanArea?.UrbanId
      if(this.building.CategoryId){


          this.http.post<any>(this.host_api + 'BuildingCategory/Update', this.building).subscribe(
              result =>{
                this.building.Address = this.selectAddress;
                let index = this.buildings.findIndex(item=>item.CategoryId==this.building.CategoryId)
                this.buildings[index] = this.building;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                this.buildings = [...this.buildings];
                this.buildingDialog = false;
                this.building = {};
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
        // this.building.AddressId = this.building.Address?.AddressId
        // this.building.UrbanId = this.building.UrbanArea?.UrbanId
        this.building.Address = undefined;
        this.building.UrbanArea = undefined;
        this.http.post<any>(this.host_api+ 'BuildingCategory/Create',this.building).subscribe(
          (result)=>{
            debugger;
            // this.permission.PermissionId = result;
            this.building.Address = this.selectAddress;
            this.building.CategoryId = result;
            this.buildings.unshift(this.building);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
            this.buildings = [...this.buildings];
            this.buildingDialog = false;
            this.building = {};
            this.selectAddress={};
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
  deleteBuilding(building: BuidingCategory){
    if(confirm(`Bạn có muốn xóa DM tòa nhà ${building.CategoryName} không?`)){
          this.http.get<any>(this.host_api+ 'BuildingCategory/Delete/' + building.CategoryId).subscribe(
            data => {
              const index = this.buildings.indexOf(building);
              if (index !== -1) {
                this.buildings.splice(index, 1);
              }
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment Deleted', life: 3000 });
            },
            (error) => {
                console.error('Error fetching apartment:', error);
            }
        );

    };
  }
  deleteSelectedBuilding() {
    debugger;
      if(confirm(`Bạn có muốn xóa danh sách DM tòa nhà không?`)){

      this.http.post<any>(this.host_api+"BuildingCategory/DeleteMultiple",this.selectedBuildings).subscribe(
        data=>{
          if(data== true){
            this.buildings = this.buildings.filter((val) => !this.selectedBuildings?.includes(val));
            this.selectedBuildings = null;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000 });
          }
          else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
          }

        }
      )
    }
  }
}
