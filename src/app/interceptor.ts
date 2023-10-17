import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');
    if (token) {
      const cloned = request.clone(request = request.clone({
        setHeaders:{Authorization: `Bearer ${token}`}
      }));

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
                alert("Bạn không có quyền thực hiện chức năng này")
            }
            // Handle other types of errors as needed
            return throwError(error);
        })
    );
  }
  else {
      return next.handle(request);
  }
  }
}

