export interface Appointment {
    id?: number;  
    administratorsId: number;
    companyId: number; 
    start: string; 
    endTime: string;
    duration: number;   
    reservationId: number;
    administratorsName?: string;
    administratorsSurname?: string;
    status?: AppointmentStatus;
}
export enum AppointmentStatus {
    Available = 0,
    Reserved = 1,
    Collected = 2
}