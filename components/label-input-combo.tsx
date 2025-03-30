import { cn } from "@/lib/utils";
import { Patient } from "@/types/patient";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { Label } from "./ui/label";
import Pill from "./pill";
import { Input } from "./ui/input";

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

export default function LabelInput({
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
}: LabelCombination) {
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
      />
    </div>
  );
}

interface MessageProps {
  optional?: boolean;
  isValid: boolean;
  disabled?: boolean;
  customMessage: string;
}

function Message({ optional, isValid, disabled, customMessage }: MessageProps) {
  if (optional) {
    return <span className="text-muted-foreground italic">Optional</span>;
  }

  if (disabled || isValid) return;

  return (
    <Pill
      className="peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
      message={customMessage}
    />
  );
}
