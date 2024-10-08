export interface Person {
    userID: number;
    email: string;
    password: string;
    name: string;
    surname: string;
    city: string;
    country: string;
    phone: string;
    profession: string;
    companyInfo: string;
    memberSince: Date;
    activationLink?: string;
    isActivated: number;
  }