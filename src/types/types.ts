export interface Caregiver {
  id: number;
  name: string;
}

export interface Patient {
  id: number;
  name: string;
}

export interface Shift {
  id: number;
  start_time: Date;
  end_time: Date;
  patient_id: number;
  caregiver_id: number;
}
