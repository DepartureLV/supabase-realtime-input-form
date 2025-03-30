export type Patient = {
    id: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    date_of_birth: string | null;
    gender: string | null;
    phone_number: string | null;
    email: string | null;
    address: string | null;
    preferred_language: string | null;
    nationality: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    religion: string | null;
    has_submitted?: boolean;
  };