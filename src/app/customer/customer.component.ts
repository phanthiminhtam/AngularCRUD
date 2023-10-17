import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from 'src/domain/customer';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class CustomerComponent implements OnInit{
        customers!: Customer[];
        customerDialog: boolean=false;
        selectedCustomers!: Customer[] | null;
        customer!: Customer;
        submitted: boolean = false;
        host_api: string = "https://localhost:7123/api/";
        host_image: string = "https://localhost:7123/ImageKhachHang/"
        constructor(private http: HttpClient,private datePipe:DatePipe, private messageService: MessageService, private confirmationService: ConfirmationService) {};

        ngOnInit() {
          this.getCustomers();
       }
       hideDialog() {
        this.customerDialog = false;
        this.submitted = false;
      }
      getCustomers() {
        debugger;
          this.http.get<any[]>(this.host_api+ 'Customer/khachhang_getall').subscribe(
              (result) => {
                  this.customers = result;
                  this.customers.forEach((value,index)=>{
                    value.Hinhanh = this.host_image + value.Hinhanh
                  })
              },
              (error) => {
                  console.error('Error fetching customers:', error);
              }
          );
      }

      openNew() {
          this.customer = {};
          this.submitted = false;
          this.customerDialog = true;
      }
      editCustomer(customer: Customer) {
          this.customer = { ...customer };
          if (typeof this.customer.Ngaycap === 'string' && Date.parse(this.customer.Ngaycap)) {
            this.customer.Ngaycap = new Date(this.customer.Ngaycap);
          }
          this.customer.Hinhanh =this.customer.Hinhanh;
          this.customerDialog = true;
      }
      saveCustomer() {
        this.submitted = true;
        debugger;
        var formData = new FormData();

        formData.append("Tenkhachhang",this.customer.Tenkhachhang?? '');
        formData.append("Cccd", this.customer.Cccd?? '');
        formData.append("Email", this.customer.Email?? '');
        formData.append("Sodienthoai", this.customer.Sodienthoai?? '');
        formData.append("Diachi", this.customer.Diachi?? '');
        formData.append("FileImage",this.customer.FileImage?? '');
        if (this.customer.Ngaycap) {
          let formattedNgaycap = this.datePipe.transform(this.customer.Ngaycap, 'yyyy-MM-dd');
          formData.append("Ngaycap", formattedNgaycap?? '');
        }
        if(this.customer.Tenkhachhang?.trim() && this.customer.Cccd?.trim() && this.customer.Email?.trim()
        && this.customer.Email?.trim()&& this.customer.Sodienthoai && this.customer.Ngaycap) {
            if (this.customer.Makhachhang) {
              formData.append("Makhachhang", this.customer.Makhachhang.toString());
              if(typeof this.customer.Hinhanh == "string"){
                let ha = this.customer.Hinhanh.substring(this.customer.Hinhanh.lastIndexOf("/")+1)
                formData.append("Hinhanh",ha)
              }
              this.http.post<any>(this.host_api+ 'Customer/khachhang_update',formData).subscribe(
                existingModel=>{
                  let index = this.customers.findIndex(item=>item.Makhachhang===this.customer.Makhachhang)
                  this.customers[index] = this.customer;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
                  this.customers = [...this.customers];
                  this.customerDialog = false;
                  this.customer = {};
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
            } else {
              this.http.post<any>(this.host_api+ 'Customer/khachhang_createsingle',formData).subscribe(
                result=>{
                  result.Hinhanh = this.host_image + result.Hinhanh
                  this.customers.unshift(result);
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
                  this.customers = [...this.customers];
                  this.customerDialog = false;
                  this.customer = {};
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

    onFileSelected(event: Event){
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if(file){
        const reader = new FileReader();
        reader.onload = () => {
          this.customer.Hinhanh = reader.result;
          this.customer.FileImage = file
        };
        reader.readAsDataURL(file);
      }
    }
    deleteCustomer(customer: Customer) {
      if(confirm(`Bạn có muốn xóa khách hàng ${customer.Tenkhachhang} không?`)){
        this.http.get<any>(this.host_api+ 'Customer/khachhang_delete/' + customer.Makhachhang).subscribe(
          data => {
            const index = this.customers.indexOf(customer);
            if (index !== -1) {
              this.customers.splice(index, 1);
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000 });
          },
          (error) => {
              console.error('Error fetching customers:', error);
          }
      );
      }
   }
      deleteSelectedCustomers() {
        if(confirm(`Bạn có muốn xóa khách hàng  không?`)){
        this.http.post<any>(this.host_api+"Customer/khachhang_deletemultiple",this.selectedCustomers).subscribe(
          data=>{
            if(data.messageCode == null){
              this.customers = this.customers.filter((val) => !this.selectedCustomers?.includes(val));
              this.selectedCustomers = null;
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
