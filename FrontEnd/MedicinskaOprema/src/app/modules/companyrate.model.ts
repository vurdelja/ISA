export interface CompanyRate {

    id: number;
    rate: number;
    highQuality: boolean;
    lowQuality: boolean;
    cheap: boolean;
    expensive: boolean;
    wideSelection: boolean;
    limitedSelection: boolean;
    description: string;
    companyId: number;
  }

  export interface CompanyRate1 {
    companyId: number;
    userId: number;
    rate: number;
    highQuality: boolean;
    lowQuality: boolean;
    cheap: boolean;
    expensive: boolean;
    wideSelection: boolean;
    limitedSelection: boolean;
    description: string;
}
