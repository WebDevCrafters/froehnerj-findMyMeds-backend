import { MedicationStatus } from "./enums/MedicationStatus";

export interface Medication {
  medicationId: string;
  name: string;
  dose: string;
  quantity: number;
  brandName: string;
  alternatives?: string[];
  earliestPickupDate: Date;
  status: MedicationStatus;
}
