import { UrbanArea } from './urbanarea';
import { Address } from './address';
export interface BuidingCategory{
  CategoryId?: number|string;
  UrbanId?: number|string;
  AddressId?: number|string;
  CategoryName?: string;

  Address?: Address;
  UrbanArea?: UrbanArea;


}
