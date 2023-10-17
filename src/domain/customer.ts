export interface Customer{
  Makhachhang?: number| string;
  Tenkhachhang?: string;
  Cccd?: string;
  Ngaycap?: string  | Date;
  Hinhanh?: string | ArrayBuffer | null;
  Sodienthoai?:string;
  Email?: string;
  Diachi?: string;
  FileImage?:File;
}
