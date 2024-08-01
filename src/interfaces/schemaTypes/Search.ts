import { PaymentStatus } from "./enums/PaymentStatus";
import { SearchStatus } from "./enums/SearchStatus";

export interface Search {
  searchId: string;
  userId: string;
  medications: string[];
  packageId: string;
  paymentStatus: PaymentStatus;
  status: SearchStatus;
}
