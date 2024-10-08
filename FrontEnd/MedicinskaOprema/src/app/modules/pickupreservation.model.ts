export interface PickupReservation {
    id: number;
    userId: number;
    equipmentIds: number[];
    isCollected: boolean;
    companyId: number;
    appointmentDate: Date;
    appointmentDuration: number;
    appointmentTime: Date;
  }
  