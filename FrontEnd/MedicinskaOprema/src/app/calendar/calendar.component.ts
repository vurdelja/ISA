
import { DatePipe } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AuthService } from 'src/app/services/auth.service';  // Prilagodite putanju prema vašem projektu

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
   calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,dayGridYear,timeGridMonth',
    },
    views: {
      dayGridMonth: {
        titleFormat: { month: 'long', year: 'numeric' },
      },
      timeGridWeek: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      },
      dayGridYear: { // Add a 'year' view
        type: 'dayGridYear',
        // You can customize other options specific to the yearly view here
      },
      timeGridMonth: {
        titleFormat: { year: 'numeric', month: 'long' },
      },
    },
  };

  constructor(private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    // Postavite datum za koji želite dohvatiti termine
    const date = new Date(); // Prilagodite datum prema vašim potrebama

    this.authService.getAppointmentsForDay(date)
      .subscribe(appointments => {
        this.calendarOptions.events = this.mapAppointmentsToCalendarEvents(appointments);
      });
  }

  private mapAppointmentsToCalendarEvents(appointments: any[]): any[] {
    // Mapiraj termine u događaje za kalendar
    return appointments.map(appointment => ({
      title: `${appointment.duration} min, ${appointment.administratorsName}, ${appointment.administratorsSurname}`,
      start: this.datePipe.transform(appointment.date, 'yyyy-MM-ddTHH:mm:ss.SSSZ'),  
      color: 'green'  // Možete postaviti boju prema potrebi
    }));
  }
  
}
