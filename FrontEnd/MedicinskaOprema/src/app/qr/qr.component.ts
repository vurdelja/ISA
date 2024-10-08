import { Component, ElementRef, ViewChild } from '@angular/core';
import decodeQRFromImage from 'jsqr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent {

  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>; 
  reservationData: any; // Definicija promenljive za podatke o rezervaciji
  showPopup : boolean =false;
  constructor(private authService: AuthService) { }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          this.decodeQRCode(image);
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  decodeQRCode(image: HTMLImageElement): void {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
  
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = decodeQRFromImage(imageData.data, imageData.width, imageData.height);
  
      if (code) {
        try {
          const qrData = JSON.parse(code.data);
          if (qrData && qrData.id) {
            const reservationId = qrData.id;
            console.log('Reservation ID:', reservationId);
  
            // Pozivamo metodu iz AuthService-a da dobijemo podatke na osnovu ID-a rezervacije
            this.authService.getReservationDataById(reservationId).subscribe(
              (data) => {
                console.log('Podaci o rezervaciji:', data);
                this.reservationData = data; // Postavljamo podatke o rezervaciji
  
                // Pozivamo metodu iz AuthService-a da provjerimo je li rezervacija istekla
                this.authService.didReservationExpire(reservationId).subscribe(
                  (isExpired) => {
                    if (isExpired) {
                      console.log('Rezervacija je istekla.');
                      // Dodajte kod za prikazivanje popup-a ili poruke
                      this.showPopup = true; // Postavljamo showPopup na true ako je rezervacija istekla
                    } else {
                      console.log('Rezervacija nije istekla.');
                      // Dodajte odgovarajuću logiku ako rezervacija nije istekla
                    }
                  },
                  (error) => {
                    console.error('Greška pri provjeri rezervacije:', error);
                  }
                );
  
              },
              (error) => {
                console.error('Greška pri dobijanju podataka o rezervaciji:', error);
              }
            );
  
          } else {
            console.error('Nepravilan format QR koda.');
          }
        } catch (error) {
          console.error('Greška pri parsiranju JSON-a:', error);
        }
      } else {
        console.error('Nije pronađen QR kod na slici.');
      }
    }
  }
  
  markReservationAsCollected(): void {
    // Pozivamo metodu iz AuthService-a za označavanje rezervacije kao preuzete
    this.authService.reservationCollected(this.reservationData.reservation.id).subscribe(
      (data) => {
        console.log('Rezervacija označena kao preuzeta:', data);
        // Dodajte odgovarajuću logiku nakon što se rezervacija označi kao preuzeta
      },
      (error) => {
        console.error('Greška pri označavanju rezervacije kao preuzete:', error);
      }
    );
  }
  
  
}