export interface User{
  Id?:string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Password?: string;
  ConfirmPassword?: string;
  NewPassWord?:string;
  PermissionUsers?:any[];
}
