import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
Injectable()
export class CitizenService {
  constructor (private http:HttpClient){

  }
  getCitizentsData() {
      return [
        {
          id: 'SV01',
          name: 'Phan Thị Minh Tâm',
          image: 'https://we25.vn/media2018/Img_News/2019/10/03/cuu-sv-su-pham-xinh-dep_20191003100438.jpg',
          dateOfBirth:new Date(2001, 7, 2),
          address: 'Tan Dan-Khoai Chau - Hung Yen',
          gender:false,
          phoneNumber:'0937483747',
          email:'tam@gmail.com'
      },
      {
        id: 'SV02',
        name: 'Nguyen Van A',
        image: 'https://toplist.vn/images/800px/sera-studio-316585.jpg',
        dateOfBirth: new Date(1978, 9, 7),
        address: '123 Street, City, Country',
        gender: false,
        phoneNumber: '0987654321',
        email: 'nguyenvana@gmail.com'
      },
      {
        id: 'SV03',
        name: 'Tran Thi B',
        image: 'data:image/jpeg;base64,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',
        dateOfBirth: new Date(1983,9,15),
        address: '456 Avenue, Town, Country',
        gender: true,
        phoneNumber: '0912345678',
        email: 'tranthib@gmail.com'
      },
      {
        id: 'SV04',
        name: 'Le Van C',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScf6mRs9KDkJXiFfSOZjPYxrxiEk003EFebQ&usqp=CAU',
        dateOfBirth: new Date(2002, 12,12),
        address: '789 Road, Village, Country',
        gender: false,
        phoneNumber: '0943212345',
        email: 'levanc@gmail.com'
      },
      {
        id: 'SV05',
        name: 'Tran Van Dung',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUoRXJGxpLrolvcvBCQAFcMzbuex2tc4usjQ&usqp=CAU',
        dateOfBirth: new Date(1998, 11,18),
        address: 'Quang Trung - Hanoi',
        gender: false,
        phoneNumber: '0965423789',
        email: 'dungtv@gmail.com'
      },
      {
        id: 'SV06',
        name: 'Nguyen Thi Hoa',
        image: 'https://we25.vn/media2018/Img_News/2019/10/03/cuu-sv-su-pham-xinh-dep_20191003100438.jpg',
        dateOfBirth: new Date(2006,5,9),
        address: 'Ly Thuong Kiet - Ho Chi Minh City',
        gender: true,
        phoneNumber: '0934567812',
        email: 'hoant@gmail.com'
      },
      {
        id: 'SV07',
        name: 'Tran Van An',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScf6mRs9KDkJXiFfSOZjPYxrxiEk003EFebQ&usqp=CAU',
        dateOfBirth:new Date(2003, 4,5),
        address: 'Dien Bien Phu - Da Nang',
        gender: false,
        phoneNumber: '0987456321',
        email: 'antran@gmail.com'
      },
      {
        id: 'SV08',
        name: 'Nguyen Thi Lan',
        image: 'https://toplist.vn/images/800px/sera-studio-316585.jpg',
        dateOfBirth: new Date(2001,9,8),
        address: 'Le Loi - Hue',
        gender: true,
        phoneNumber: '0945678234',
        email: 'lannt@gmail.com'
      },
      {
        id: 'SV09',
        name: 'Le Van Hieu',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpSt0ebNpx7EubfaXfvPlSUyiTDNMU3BTaGQ&usqp=CAU',
        dateOfBirth: new Date(2002,8,14),
        address: 'Tran Phu - Can Tho',
        gender: false,
        phoneNumber: '0967432190',
        email: 'hieulv@gmail.com'
      },
      {
        id: 'SV10',
        name: 'Tran Thi Thanh',
        image: 'https://we25.vn/media2018/Img_News/2019/10/03/cuu-sv-su-pham-xinh-dep_20191003100438.jpg',
        dateOfBirth: new Date(2002, 8,16),
        address: 'Nguyen Trai - Hai Phong',
        gender: true,
        phoneNumber: '0938901256',
        email: 'thanhtt@gmail.com'
      }
      ];
  }
  getCitizens() {
      return Promise.resolve(this.getCitizentsData());
  }

  signUp(newUser: any): Observable<any> {
    return this.http.post(`https://localhost:7123/api/Account/SignUp`, newUser);
  }
};
