import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router)
    const jwt = inject(JwtHelperService)
    const token = sessionStorage.getItem('token');
    if(token && !jwt.isTokenExpired(token))
    {
      const dataPermissions = sessionStorage.getItem('permissions')||""
      const listPermission = JSON.parse(dataPermissions);
      // const decodeToken = jwt.decodeToken(token)
      // debugger
      // var listRole = decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      const requredRole = route.data['requiredRole']
      if( listPermission && (listPermission.includes(requredRole) || listPermission.includes("Admin"))){
          return true;
      }
      else{
        alert("Bạn không có quyền!");
        return false;
      }
    }
    else{
      router.navigate(["/login"])
      return false;
    }
};
