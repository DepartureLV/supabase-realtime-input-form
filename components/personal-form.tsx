import { cn } from "@/lib/utils";
import { Patient } from "@/type/patient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Pill from "./pill";

interface PersonalFormProps {
  formData: Patient;
  handleChange?: (e: React.ChangeEvent) => void;
  handleSubmit?: (e: React.FormEvent) => void;
  disabled?: boolean;
  emailDuplicate?: boolean;
  className?: string;
}

export default function PersonalForm({
  formData,
  handleChange,
  handleSubmit,
  disabled = false,
  emailDuplicate = false,
  className,
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
        label={"Firt name"}
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
        <Button
          type="submit"
          className="col-span-1 md:col-span-2"
          disabled={!isFormValid()}
        >
          Submit
        </Button>
      )}
    </form>
  );
}

interface LabelCombination {
  label: string;
  value: string | null;
  optional?: boolean;
  handleChange?: (e: React.ChangeEvent) => void;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  className?: string;
  htmlFor: keyof Patient;
  duplicate?: boolean;
  updateValidity?: (field: string, isValid: boolean) => void;
}

const LabelInput = ({
  label,
  value,
  optional,
  handleChange,
  type = "text",
  disabled,
  htmlFor,
  className,
  duplicate,
  updateValidity,
}: LabelCombination) => {
  const [isValid, setIsValid] = useState(false);
  const [customMessage, setCustomMessage] = useState("Require");

  const checkValidity = (
    value: string | null
  ): { validity: boolean; message: string } => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        validity: emailRegex.test(value || ""),
        message: (value || "").length > 0 ? "Invalid email" : "Required",
      };
    }

    if (type === "tel") {
      const phoneRegex = /^(?:\+66|66|0)?([689]{1})\d{8}$/;
      return {
        validity: phoneRegex.test(value || ""),
        message: (value || "").length > 0 ? "Invalid phone number" : "Required",
      };
    }

    return { validity: (value || "").length > 0, message: "Required" };
  };

  useEffect(() => {
    const { validity, message } = checkValidity(value);

    if (duplicate && validity) {
      setIsValid(false);
      setCustomMessage("Already in use");
      return;
    }

    setIsValid(validity);
    setCustomMessage(message);

    if (updateValidity) {
      if (optional && (!value || value.length === 0)) {
        updateValidity(htmlFor, true);
      } else {
        updateValidity(htmlFor, validity);
      }
    }
  }, [value, duplicate]);

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="h-6 w-full flex items-center">
        <Label htmlFor={htmlFor} className="w-full text-wrap flex-1">
          {label}:
        </Label>
        <Message
          optional={optional}
          isValid={isValid}
          disabled={disabled}
          customMessage={customMessage}
        />
      </div>
      <Input
        type={type}
        id={htmlFor}
        name={htmlFor}
        value={value || ""}
        onChange={handleChange}
        readOnly={disabled}
        required={!optional}
        className="peer"
        placeholder=""
        // pattern={pattern?.toString()}
      />
    </div>
  );
};

interface MessageProps {
  optional?: boolean;
  isValid: boolean;
  disabled?: boolean;
  customMessage: string;
}

function Message({ optional, isValid, disabled, customMessage }: MessageProps) {
  if (disabled || isValid) return;

  if (optional) {
    return <span className="text-muted-foreground italic">Optional</span>;
  }

  return (
    <Pill
      className="peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
      message={customMessage}
    />
  );
}
