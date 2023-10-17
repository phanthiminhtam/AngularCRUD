import { Component ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/domain/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from 'src/service/productservice';
import { ShareDataService } from '../service/share-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(private http:HttpClient,private router:Router, private service: ProductService, private shareData:ShareDataService){}
    user:User={};
    // roles: User[]=[{Role:'User'},{Role:'Admin'},{Role:'Customer'},{Role:'HR'}];
    selectedRoles: User[]=[];
    host_api: string = "https://localhost:7123/api/";

    SignUp(){
      debugger;

      this.service.signUp(this.user).subscribe(
        result=>{
          debugger;
             if(result==true){
                  // this.navigateToLogin();
                  alert('Đăng ký thành công!');
                this.router.navigate(['/login']);
             }
             else{
                alert("Đăng ký không thành công!");
             }
        }
      )
    };

    SignIn(){
      this.http.post<string>(this.host_api+"Account/SignIn", this.user).subscribe((data:any)=> {
        debugger;
        let result = data
        sessionStorage.setItem('token',result.token)
        sessionStorage.setItem('permissions',JSON.stringify(result.permissions))
        this.shareData.setSharedData({permissions:result.permissions, tab: 'home'})
        this.router.navigate(["/home"])
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
}
