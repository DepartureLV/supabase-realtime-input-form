import { cn } from "@/lib/utils";
import { Patient } from "@/types/patient";
import { useState } from "react";
import { SubmitStatus } from "@/types/submit_status";
import MultipleStateButton from "./multiple-state-button";
import LabelInput from "./label-input-combo";

interface PersonalFormProps {
  formData: Patient;
  handleChange?: (e: React.ChangeEvent) => void;
  handleSubmit?: (e: React.FormEvent) => void;
  disabled?: boolean;
  emailDuplicate?: boolean;
  className?: string;
  submitStatus?: SubmitStatus;
}

export default function PersonalForm({
  formData,
  handleChange,
  handleSubmit,
  disabled = false,
  emailDuplicate = false,
  className,
  submitStatus = "idle",
}: PersonalFormProps) {
  const [fieldsValidity, setFieldsValidity] = useState<Record<string, boolean>>(
    {}
  );

  const isFormValid = () => {
    const requiredFields: (keyof Patient)[] = [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "phone_number",
      "email",
      "address",
      "preferred_language",
      "nationality",
    ];

    return requiredFields.every((field) => fieldsValidity[field] === true);
  };

  const updateFieldValidity = (field: string, isValid: boolean) => {
    setFieldsValidity((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit ? handleSubmit : () => {}}
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 w-full", className)}
    >
      <LabelInput
        htmlFor="first_name"
        label={"First name"}
        value={formData.first_name}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="middle_name"
        label={"Middle name"}
        value={formData.middle_name}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
        optional
      />
      <LabelInput
        htmlFor="last_name"
        label={"Last name"}
        value={formData.last_name}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="date_of_birth"
        label={"Date of birth"}
        type="date"
        value={formData.date_of_birth}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="gender"
        label={"Gender"}
        value={formData.gender}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="phone_number"
        label={"Phone number"}
        value={formData.phone_number}
        type="tel"
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="email"
        label={"Email"}
        type="email"
        value={formData.email}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
        duplicate={emailDuplicate}
      />
      <LabelInput
        htmlFor="address"
        label={"Address"}
        value={formData.address}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="preferred_language"
        label={"Preferred language"}
        value={formData.preferred_language}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="nationality"
        label={"Nationality"}
        value={formData.nationality}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
      />
      <LabelInput
        htmlFor="emergency_contact_name"
        label={"Emergency contact name"}
        value={formData.emergency_contact_name}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
        optional
      />
      <LabelInput
        htmlFor={"emergency_contact_relationship"}
        label={"Emergency contact relationship"}
        value={formData.emergency_contact_relationship}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
        optional
      />
      <LabelInput
        htmlFor={"religion"}
        label={"Religion"}
        value={formData.religion}
        handleChange={handleChange ? handleChange : () => {}}
        disabled={disabled}
        updateValidity={updateFieldValidity}
        optional
      />

      {!disabled && (
        <MultipleStateButton status={submitStatus} disabled={!isFormValid()} />
      )}
    </form>
  );
}
