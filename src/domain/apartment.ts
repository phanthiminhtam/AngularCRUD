import { BuidingCategory } from "./buildingcategory";

export interface Apartment{
  ApartmentId?:number|string;
  CategoryId?: string | number | undefined;
  ApartmentName?: string;
  Building?:string;
  Space?: number;
  Floor?: number;

  BuildingCategory?:BuidingCategory

}
