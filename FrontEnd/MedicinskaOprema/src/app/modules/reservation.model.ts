export interface Reservation {
    id?: number;  
    userId: number;
    equipmentId: number;
    equipmentCount: number; 
    deadline: string;  
    isCollected: boolean;
    companyId: number;
    appointmentTime: string;
    name?: string;
    surname?:string;
}