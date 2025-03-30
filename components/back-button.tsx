'use client'

import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant={"link"} className="p-0" onClick={() => router.back()}>
      <ChevronLeft />
      Back
    </Button>
  );
}
