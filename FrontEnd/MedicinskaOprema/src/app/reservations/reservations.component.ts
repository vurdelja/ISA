import { Component, OnInit } from '@angular/core';
import { Reservation } from '../modules/reservation.model';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = []; // Polje za spremanje rezervacija

  constructor(private reservationService: AuthService) { }

  ngOnInit(): void {
    this.getAllReservations(); // Dohvaćanje svih rezervacija kada se komponenta inicijalizira
  }

  getAllReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      (reservations: Reservation[]) => {
        this.reservations = reservations;
      },
      (error) => {
        console.error('Greška prilikom dohvaćanja rezervacija:', error);
      }
    );
  }
}
