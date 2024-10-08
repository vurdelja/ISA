import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company,Company1 } from '../modules/company.model';
import { User} from '../modules/user.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  baseServerUrl = "https://localhost:44374/api/";


  companyreg(company: Company1, selectedUserId: number): Observable<any> {
    return this.http.post(
      this.baseServerUrl + `Company/RegisterCompany/${selectedUserId}`,
      company,
      { responseType: 'text' }
    );
  }
  

  getUsersByRole(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseServerUrl}User/GetUsersByRole`);
  }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseServerUrl}Company/GetAllCompanies`);
  }
  
  
}
