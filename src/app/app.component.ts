import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShareDataService } from './service/share-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'New_Project2';
  showResident: boolean = false;
  showApartment: boolean = false;
  showUser: boolean = false;
  showPermission: boolean = false;
  showCustomer: boolean = false;
  showBuildingCategory: boolean = false;
  showAddress: boolean = false;
  showUrbanArea: boolean = false;
  tab: string = ""
  private subscription: Subscription;

  constructor(private router: Router,private sharedData: ShareDataService){
    debugger
    this.subscription = this.sharedData.sharedData$.subscribe(data=>{
      if(data){
        data.permissions.forEach((permission:any) => {
          if(permission==="Admin"){
            this.showResident = true;
            this.showApartment = true;
            this.showUser = true;
            this.showPermission = true;
            this.showCustomer = true;
            this.showAddress = true;
            this.showBuildingCategory = true;
            this.showUrbanArea = true;
            return true;
          }
          else if(permission === "Apartment_GetAll"){
                this.showApartment = true;
            }else if(permission === "Resident_GetAll"){
              this.showResident = true;
            }else if(permission === "User_GetAll"){
              this.showUser = true;
            }
             else if(permission === "Permission_GetAll"){
              this.showPermission = true;
             }
             else if(permission === "Customer_GetAll"){
              this.showCustomer = true;
             }else if(permission === "BuildingCategory_GetAll"){
              this.showBuildingCategory = true;
             }
             else if(permission === "Address_GetAll"){
              this.showAddress = true;
             }
             else if(permission === "UrbanArea_GetAll"){
              this.showUrbanArea = true;
             }
             return false;
        });
        this.tab = data.tab
      }
    })
}

  logout(){
    sessionStorage.removeItem("token")
    this.router.navigate(["/login"])
}
}



