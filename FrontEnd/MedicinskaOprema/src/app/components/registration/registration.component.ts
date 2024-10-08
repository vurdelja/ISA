import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  repeatedPassword: string ='none';
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
  }

  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rpassword: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    city: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    country: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    number: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10), Validators.maxLength(10)]),
    profession: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    companyInfo: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])

  });

 registerSubmited(){
  if(this.Password.value== this.RPassword.value)
  {
    //console.log("Submited succesfuly");
    this.repeatedPassword='none' 
    this.authService.registerUser([
      this.registrationForm.value.email || '',
      this.registrationForm.value.password || '',
      this.registrationForm.value.name || '',
      this.registrationForm.value.surname || '',
      this.registrationForm.value.city || '',
      this.registrationForm.value.country || '',
      this.registrationForm.value.number || '',
      this.registrationForm.value.profession || '',
      this.registrationForm.value.companyInfo || ''
    ]).subscribe(res => {
      //this.authService.setToken(res)
      console.log(res);
    })

  }else
  {
    this.repeatedPassword = 'inline'
  }
 }
  
 get Email():FormControl{
  return this.registrationForm.get('email') as FormControl;
 }
 get Password():FormControl{
  return this.registrationForm.get('password') as FormControl;
 }
 get RPassword():FormControl{
  return this.registrationForm.get('rpassword') as FormControl;
 }
 get Name():FormControl{
  return this.registrationForm.get('name') as FormControl;
 }
 get Surname():FormControl{
  return this.registrationForm.get('surname') as FormControl;
 }
 get City():FormControl{
  return this.registrationForm.get('city') as FormControl;
 }
 get Country():FormControl{
  return this.registrationForm.get('country') as FormControl;
 }
 get Number():FormControl{
  return this.registrationForm.get('number') as FormControl;
 }
 get Profession():FormControl{
  return this.registrationForm.get('profession') as FormControl;
 }
 get CompanyInfo():FormControl{
  return this.registrationForm.get('companyInfo') as FormControl;
 }

}