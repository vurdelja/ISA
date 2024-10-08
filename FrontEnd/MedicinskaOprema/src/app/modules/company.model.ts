
import { Equipment } from "./equipment.model";
import { User } from "./user.model";

export interface Company {
    id: number;
    name: string;
    address: string;
    description: string;
    averageRating: number;
    otherAdministrators: User[]; 
    equipment: Equipment[];
    equipmentId?: number;
    openingTime: any;
    closingTime:any;
    
}

export interface Company1 {
   
    name: string;
    address: string;
    description: string;
    administrators: number[]; // Dodajte polje za ID-jeve administratora
    openingTime: string; // Adjust the type to match your backend representation
    closingTime: string;
    
  }

