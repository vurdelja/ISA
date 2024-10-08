import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company,Company1 } from '../modules/company.model';
import { User} from '../modules/user.model';
import { Equipment } from '../modules/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) { }

  baseServerUrl = "https://localhost:44374/api/";
  getAllEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.baseServerUrl}Equipment/GetAllEquipments`);
  }
  GetEquipmentById(equipmentId: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.baseServerUrl}Equipment/GetEquipmentById/${equipmentId}`);
  }
  GetCompanybyEquipmentId(equipmentId: number): Observable<Company1[]> {
    console.log('Requesting equipment for equipmentId:', equipmentId);
    return this.http.get<Company1[]>(`${this.baseServerUrl}Company/GetCompanybyEquipmentId/${equipmentId}`);
  }
 
}
