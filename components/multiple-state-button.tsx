import { SubmitStatus } from "@/types/submit_status";
import { LoaderCircle, Check, CircleAlert } from "lucide-react";
import { Button } from "./ui/button";

export default function MultipleStateButton({
  status,
  disabled,
}: {
  status: SubmitStatus;
  disabled: boolean;
}) {
  if (status === "loading") {
    return (
      <Button disabled={disabled} className="col-span-1 md:col-span-2">
        <span className="flex items-center gap-2">
          <LoaderCircle className="animate-spin" />
          Submitting...
        </span>
      </Button>
    );
  }

  if (status === "success") {
    return (
      <Button
        disabled={disabled}
        className="col-span-1 md:col-span-2 bg-green-500 hover:bg-green-500/90"
      >
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Submitted
        </span>
      </Button>
    );
  }

  if (status === "failed") {
    return (
      <Button
        disabled={disabled}
        className="col-span-1 md:col-span-2 bg-red-500 hover:bg-red-500/90"
      >
        <span className="flex items-center gap-2">
          <CircleAlert className="h-4 w-4" />
          Error
        </span>
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      className="col-span-1 md:col-span-2"
      disabled={disabled}
    >
      {status === "idle" && "Submit"}
    </Button>
  );
}
