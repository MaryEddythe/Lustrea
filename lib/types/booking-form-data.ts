export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  paymentProof?: File;
  designImage?: File;
}
