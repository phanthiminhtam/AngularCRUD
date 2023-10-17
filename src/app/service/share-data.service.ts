import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private sharedDataSubject = new Subject<any>();

  sharedData$ = this.sharedDataSubject.asObservable();

  setSharedData(data: any) {
    this.sharedDataSubject.next(data);
  }

}
