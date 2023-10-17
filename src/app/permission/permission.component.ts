import { Component , OnInit} from '@angular/core';
import { Permission } from 'src/domain/permission';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/domain/role';
import { ShareDataService } from '../service/share-data.service';
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class PermissionComponent  implements OnInit{
      roles!: Role[];
      role!:Role;
      selectRoles:any[]=[];
      permissions!:Permission[];
      permissionDialog: boolean=false;
      permission!:Permission;
      selectedPermissions!: Permission[] | null;
      submitted: boolean = false;
      host_api: string = "https://localhost:7123/api/";

      showbtCreate: boolean = false;
      showbtEdit: boolean = false;
      showbtDelete: boolean = false;
      showbtDeleteMulti: boolean=false;


      constructor(private shareData:ShareDataService,private http:HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService  ){}
    ngOnInit() {
        this.getPermissions();
        const dataPermissions = sessionStorage.getItem('permissions')||""
        const listPermission = JSON.parse(dataPermissions);
        this.shareData.setSharedData({permissions:listPermission, tab: 'permission'})
        if( listPermission.includes("Admin"))
        {
           this.showbtCreate=true;
           this.showbtDelete=true;
           this.showbtEdit = true;
           this.showbtDeleteMulti = true;
        }else{
        listPermission.forEach((permission:any) => {
            if(permission === "Permission_Create"){
                this.showbtCreate = true;
            }else if(permission === "Permission_Update"){
              this.showbtEdit = true;
            }else if(permission === "Permission_Delete"){
              this.showbtDelete = true;
            }
            else if(permission==="Permission_DeleteMultiple"){
               this.showbtDeleteMulti = true;
            }
        })};
    }
    hideDialog() {
      this.permissionDialog = false;
      this.submitted = false;
    }
    getPermissions() {
      debugger;
      this.http.get<any[]>(this.host_api+ 'Permission/GetAll_Role').subscribe(
        (result) => {
            this.roles = result;
        },
        (error) => {
            console.error('Error fetching customers:', error);
        }
      );
      this.http.get<any>(this.host_api+ 'Permission/GetAll').subscribe(
            (result) => {
                this.permissions = result.Result;
                this.permissions.forEach((permission) => {
                  permission.PermissionRoles?.forEach((permissionRole:any) => {
                    const roleId = permissionRole.Role.Id;
                      const role = this.roles.find(r => r.Id === roleId);
                      permissionRole.RoleName = role ? role.Name : 'Unknown Role';
                      // return role ? role.Name : 'Unknown Role';
                  });
                  permission.roleNames = permission.PermissionRoles?.map(permissionRole => permissionRole.RoleName).join(',');
              });

            },
            (error) => {
                console.error('Error fetching permissions:', error);
            }
        );
      }


    openNew() {
      debugger;
      this.permission = {};
      this.submitted = false;
      this.permissionDialog = true;
    }
    editPermission(permission: Permission) {
      debugger
      this.http.get(this.host_api+ "Permission/GetById/"+ permission.PermissionId).subscribe(
        (data:any)=>{
          this.selectRoles = this.roles.filter((val)=>data.PermissionRoles.includes(val.Id))
          this.permission= data
          this.permissionDialog = true;
        }
      )
    }
    savePermission() {
    this.submitted = true;
    debugger;

    if(this.permission.Name?.trim()){
        if(this.permission.PermissionId){
            if(this.selectRoles){
              this.permission.PermissionRoles = this.selectRoles?.map(permission => {
                return {
                  PermissionId: this.permission.PermissionId,
                  RoleId: permission.Id
                }})
            }
            this.http.post<any>(this.host_api + 'Permission/Update', this.permission).subscribe(
                result =>{

                  let index = this.permissions.findIndex(item=>item.PermissionId==this.permission.PermissionId)
                  this.permissions.forEach(() => {
                    this.permission.PermissionRoles?.forEach((permissionRole:any) => {
                      const roleId = permissionRole.RoleId;
                        const role = this.roles.find(r => r.Id === roleId);
                        permissionRole.RoleName = role ? role.Name : 'Unknown Role';
                    });
                    this.permission.roleNames = this.permission.PermissionRoles?.map(permissionRole => permissionRole.RoleName).join(',');
                  });

                  this.permissions[index] = this.permission;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                  this.permissions = [...this.permissions];
                  this.permissionDialog = false;
                  this.permission = {};
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
          if(this.selectRoles){
            this.permission.PermissionRoles = this.selectRoles.map(role => {
              return {
                RoleId: role.Id
              }})
          }
          this.http.post<any>(this.host_api+ 'Permission/Create',this.permission).subscribe(
            (result:string)=>{
              debugger;
              this.permissions.forEach(() => {
                this.permission.PermissionRoles?.forEach((permissionRole:any) => {
                  const roleId = permissionRole.RoleId;
                    const role = this.roles.find(r => r.Id === roleId);
                    permissionRole.RoleName = role ? role.Name : 'Unknown Role';
                });
                this.permission.roleNames = this.permission.PermissionRoles?.map(permissionRole => permissionRole.RoleName).join(',');
              });
              this.permission.PermissionId = result;
              this.permissions.unshift(this.permission);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
              this.permissions = [...this.permissions];
              this.permissionDialog = false;
              this.permission = {};
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
    deletePermission(permission: Permission){
      if(confirm(`Bạn có muốn xóa nhóm quyền ${permission.Name} không?`)){
            this.http.get<any>(this.host_api+ 'Permission/Delete/' + permission.PermissionId).subscribe(
              data => {
                const index = this.permissions.indexOf(permission);
                if (index !== -1) {
                  this.permissions.splice(index, 1);
                }
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'apartment Deleted', life: 3000 });
              },
              (error) => {
                  console.error('Error fetching apartment:', error);
              }
          );

      };
    }
    deleteSelectedPermissions() {
      if(confirm(`Bạn có muốn xóa nhóm quyền không?`)){
      this.http.post<any>(this.host_api+"Permission/DeleteMultiple",this.selectedPermissions).subscribe(
        data=>{
          if(data== true){
            this.permissions = this.permissions.filter((val) => !this.selectedPermissions?.includes(val));
            this.selectedPermissions = null;
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
