import { Component , OnInit} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { UrbanArea } from 'src/domain/urbanarea';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-urbanarea',
  templateUrl: './urbanarea.component.html',
  styleUrls: ['./urbanarea.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class UrbanareaComponent implements OnInit{
  showbtCreate: boolean = false;
  showbtEdit: boolean = false;
  showbtDelete: boolean = false;
  showbtDeleteMulti: boolean=false;


  urbanarea!:UrbanArea;
  urbanareas!:UrbanArea[];
  urbanareaDialog: boolean = false;
  selectedUrbanareas!:UrbanArea[]|null;
  submitted: boolean=false;
  host_api: string = "https://localhost:7123/api/";
  constructor(private shareData:ShareDataService ,private http:HttpClient, private messageService: MessageService){}

    ngOnInit() {
      this.getUrbanareas();
      const dataPermissions = sessionStorage.getItem('permissions')||""
      const listPermission = JSON.parse(dataPermissions);
      this.shareData.setSharedData({permissions:listPermission, tab: 'urbanarea'})
      if( listPermission.includes("Admin"))
      {
        this.showbtCreate=true;
        this.showbtDelete=true;
        this.showbtEdit = true;
        this.showbtDeleteMulti = true;
      }else{
      listPermission.forEach((urbanarea:any) => {
          if(urbanarea === "UrbanArea_Create"){
              this.showbtCreate = true;
          }else if(urbanarea === "UrbanArea_Update"){
            this.showbtEdit = true;
          }else if(urbanarea === "UrbanArea_Delete"){
            this.showbtDelete = true;
          }
          else if(urbanarea==="UrbanArea_DeleteMultiple"){
            this.showbtDeleteMulti = true;
          }
      })};
    }
    hideDialog() {
      this.urbanareaDialog = false;
      this.submitted = false;
    }
    getUrbanareas() {
    debugger;
    this.http.get<any[]>(this.host_api+ 'UrbanArea/GetAll').subscribe(
      (result) => {
          this.urbanareas = result;
      },
      (error) => {
          console.error('Error fetching UrbanAreas:', error);
      });
    }
    openNew() {
      this.urbanarea = {};
      this.submitted = false;
      this.urbanareaDialog = true;
    }
    editUrbanArea(urabanarea: UrbanArea) {
      debugger
      this.urbanarea = {...urabanarea};
      this.urbanareaDialog = true;

    }
    saveUrbanArea() {
    this.submitted = true;
    debugger;

    if(this.urbanarea.UrbanName?.trim()){
        if(this.urbanarea.UrbanId){
            this.http.post<any>(this.host_api + 'UrbanArea/Update', this.urbanarea).subscribe(
                result =>{
                  let index = this.urbanareas.findIndex(item=>item.UrbanId==this.urbanarea.UrbanId);
                  this.urbanareas[index] = this.urbanarea;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                  this.urbanareas = [...this.urbanareas];
                  this.urbanareaDialog = false;
                  this.urbanarea = {};
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
          this.urbanarea.Population = 0;
          this.http.post<any>(this.host_api+ 'UrbanArea/Create',this.urbanarea).subscribe(
            (result)=>{
              debugger;
              this.urbanarea.UrbanId = result;
              this.urbanareas.unshift(this.urbanarea);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UrbanAreas Created', life: 3000 });
              this.urbanareas = [...this.urbanareas];
              this.urbanareaDialog = false;
              this.urbanarea = {};
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
    deleteUrbanArea(urbanarea: UrbanArea){
      if(confirm(`Bạn có muốn xóa khu đô thị ${urbanarea.UrbanName} không?`)){
            this.http.get<any>(this.host_api+ 'UrbanArea/Delete/' + urbanarea.UrbanId).subscribe(
              data => {
                const index = this.urbanareas.indexOf(urbanarea);
                if (index !== -1) {
                  this.urbanareas.splice(index, 1);
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'urbanarea Deleted', life: 3000 });
              },
              (error) => {
                  console.error('Error fetching urbanarea:', error);
              }
          );

      };
    }
    deleteSelectedUrbanarea() {
    if(confirm(`Bạn có muốn xóa danh sách khu đô thị không?`)){
    this.http.post<any>(this.host_api+"UrbanArea/DeleteMultiple",this.selectedUrbanareas).subscribe(
      data=>{
        if(data== true){
          this.urbanareas = this.urbanareas.filter((val) => !this.selectedUrbanareas?.includes(val));
          this.selectedUrbanareas = null;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Urabanareas Deleted', life: 3000 });
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
        }
      })
    }
  }
}
