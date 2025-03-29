import { cn } from "@/lib/utils";
import { Patient } from "@/type/patient";

interface Props {
  formData: Patient;
  handleChange?: (e: React.ChangeEvent) => void;
  disabled?: boolean;
  className?: string;
}

export default function PersonalForm({
  formData,
  handleChange,
  disabled = false,
  className,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={cn("flex flex-col", className)}
    >
      <label htmlFor="first_name">First name:</label>
      <input
        type="text"
        id="firstName"
        name="first_name"
        value={formData.first_name || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="middleName">Middle Name:</label>
      <input
        type="text"
        id="middleName"
        name="middle_name"
        value={formData.middle_name || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="lastName">Last name:</label>
      <input
        type="text"
        id="lastName"
        name="last_name"
        value={formData.last_name || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="dateOfBirth">Date of Birth:</label>
      <input
        type="text"
        id="dateOfBirth"
        name="date_of_birth"
        value={formData.date_of_birth || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="gender">Gender:</label>
      <input
        type="text"
        id="gender"
        name="gender"
        value={formData.gender || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="phoneNumber">Phone number:</label>
      <input
        type="text"
        id="phoneNumber"
        name="phone_number"
        value={formData.phone_number || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="email">Email:</label>
      <input
        type="text"
        id="email"
        name="email"
        value={formData.email || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="preferredLang">Preferred Language:</label>
      <input
        type="text"
        id="preferredLang"
        name="preferred_language"
        value={formData.preferred_language || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="nationality">Nationality:</label>
      <input
        type="text"
        id="nationality"
        name="nationality"
        value={formData.nationality || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="emergencyContactName">Emergency Contact Name:</label>
      <input
        type="text"
        id="emergencyContactName"
        name="emergency_contact_name"
        value={formData.emergency_contact_name || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="emergencyContactRelationship">
        Emergency Contact Relationship:
      </label>
      <input
        type="text"
        id="emergencyContactRelationship"
        name="emergency_contact_relationship"
        value={formData.emergency_contact_relationship || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />
      <label htmlFor="religion">Religion:</label>
      <input
        type="text"
        id="religion"
        name="religion"
        value={formData.religion || ""}
        onChange={handleChange ? handleChange : () => {}}
        readOnly={disabled}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
