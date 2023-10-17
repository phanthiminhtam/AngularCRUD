export interface Resident{
  ResidentId?: number|string;
  Name?:string;
  Address?:string;
  PhoneNumber?:string;
  Email?: string;
  Cccd?:string;
  DateOfBirth?: Date;
  Gender?:boolean;

  ResidentApartments?: any
}
