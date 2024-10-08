export interface User {
  userID: number;
  email: string;
  password: string;
  userRole: UserRole;
  name: string;
  surname: string;
  companyId: number; // Assuming companyId is a number based on the context
  isPredefined: boolean; // Assuming isPredef is a boolean based on the context
  penaltyScore: number; // Assuming PenaltyScore is a number based on the context
  
}
  export enum UserRole {
    REGISTER_USER,
    CAMPAIN_ADMIN,
    SYSTEM_ADMIN,
    UNAUTHENTICATED_USER
  }

  