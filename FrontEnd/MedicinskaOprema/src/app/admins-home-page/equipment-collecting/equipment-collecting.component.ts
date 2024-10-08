import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/modules/reservation.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-equipment-collecting',
  templateUrl: './equipment-collecting.component.html',
  styleUrls: ['./equipment-collecting.component.css']
})
export class EquipmentCollectingComponent {

  companyId: number = 0;
  reservationList: Reservation[] = [];
  selectedReservation!: Reservation;
  expired: boolean = false;
  
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    //reservations
    this.authService.getAllUncollectedReservations(this.companyId).subscribe(
      (resData: Reservation[]) => {
        this.reservationList = resData;
        console.log('Res List:', this.reservationList);
      },
      (resError: any) => {
        console.error('Error fetching reservation list:', resError);
      }
    );
  }

  openReservationPopup(reservation: any) {
    
    if(reservation)
    this.selectedReservation = reservation;
    this.authService.didReservationExpire(this.selectedReservation?.id).subscribe(
      (resData: boolean) => {
        this.expired = resData;
        console.log('Expired:', this.expired);
      },
      (resError: any) => {
        console.error('Error fetching expired:', resError);
      }
    );
    const popupElement = document.getElementById('reservationPopup');
    if (popupElement) {
        popupElement.style.display = 'block';
    }
  }

  closeReservationPopup() {
      const popupElement = document.getElementById('reservationPopup');
      if (popupElement) {
          popupElement.style.display = 'none';
      }
      this.fetchReservationList();
  }
  
  markAsCollected(selectedReservation: Reservation) {
    if (selectedReservation) {
      this.authService.reservationCollected(selectedReservation.id).subscribe(
        (resData: boolean) => {
          // Call a method to fetch the updated list of reservations
          this.fetchReservationList();
        },
        (resError: any) => {
          console.error('Error marking reservation as collected:', resError);
        }
      );
      this.closeReservationPopup();
    }
  }
  
  fetchReservationList() {
    this.authService.getAllUncollectedReservations(this.companyId).subscribe(
      (resData: Reservation[]) => {
        this.reservationList = resData;
        console.log('Updated reservation list:', this.reservationList);
      },
      (resError: any) => {
        console.error('Error fetching updated reservation list:', resError);
      }
    );
  }
  

}
