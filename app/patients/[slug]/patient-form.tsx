"use client";

import PersonalForm from "@/components/personal-form";
import { OnlineStatus } from "@/types/online_status";
import { Patient } from "@/types/patient";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

export default function PatientForm({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: Patient[];
}) {
  const supabase = createClient();
  const statusRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<RealtimeChannel>(null);

  const [formData, setFormData] = useState<Patient>({
    id: id,
    first_name: defaultValue[0]?.first_name || null,
    middle_name: defaultValue[0]?.middle_name || null,
    last_name: defaultValue[0]?.last_name || null,
    date_of_birth: defaultValue[0]?.date_of_birth || null,
    gender: defaultValue[0]?.gender || null,
    phone_number: defaultValue[0]?.phone_number || null,
    email: defaultValue[0]?.email || null,
    address: defaultValue[0]?.address || null,
    preferred_language: defaultValue[0]?.preferred_language || null,
    nationality: defaultValue[0]?.nationality || null,
    emergency_contact_name: defaultValue[0]?.emergency_contact_name || null,
    emergency_contact_relationship:
      defaultValue[0]?.emergency_contact_relationship || null,
    religion: defaultValue[0]?.religion || null,
  });

  const [userStatus, setUserStatus] = useState<OnlineStatus>("inactive");
  const [isEmailDuplicate, setIsEmailDuplicate] = useState<boolean>(false);

  // init presense subscription
  useEffect(() => {
    const channel = supabase.channel("tracking");

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const user = {
          user: "patient",
          id: id,
          status: "inactive",
        };

        await channel.track(user);
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // no need to extract function as it bind to this form only
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const first_name = formData.get("first_name");
    const middle_name = formData.get("middle_name");
    const last_name = formData.get("last_name");
    const date_of_birth = formData.get("date_of_birth");
    const gender = formData.get("gender");
    const phone_number = formData.get("phone_number");
    const email = formData.get("email");
    const address = formData.get("address");
    const preferred_language = formData.get("preferred_language");
    const nationality = formData.get("nationality");
    const emergency_contact_name = formData.get("emergency_contact_name");
    const emergency_contact_relationship = formData.get(
      "emergency_contact_relationship"
    );
    const religion = formData.get("religion");
    const has_submitted = true;

    const postgresPayload = {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      gender,
      phone_number,
      email,
      address,
      preferred_language,
      nationality,
      emergency_contact_name,
      emergency_contact_relationship,
      religion,
      has_submitted,
    };

    const { error } = await supabase
      .from("patients")
      .upsert(postgresPayload, { onConflict: "email" })
      .eq("email", email)
      .select("*");

    if (error) {
      console.error("error", error);
      return;
    }

    const presencePayload: { user: string; id: string; status: OnlineStatus } =
      {
        user: "patient",
        id: id,
        status: "submitted",
      };

    await channelRef.current?.track(presencePayload);

    if (statusRef.current) {
      clearTimeout(statusRef.current);
    }
  };

  // no need to extract function as it bind to this form only
  const handleChange = async (e: React.ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    const newData = { ...formData, [name]: value };

    setFormData(newData);

    setUserStatus("editing");

    const { error } = await supabase
      .from("patients")
      .upsert(newData, { onConflict: "id" })
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("error", error);
      // need to handle other case too
      setIsEmailDuplicate(true);
      return;
    }

    if (statusRef.current) {
      clearTimeout(statusRef.current);
    }

    if (userStatus !== "editing") {
      await channelRef.current?.track({
        user: "patient",
        id: id,
        status: "editing",
      });
    }

    statusRef.current = setTimeout(() => {
      channelRef.current?.track({
        user: "patient",
        id: id,
        status: "inactive",
      });

      setUserStatus("inactive");
    }, 10000);
  };

  return (
    <div className="w-full">
      <PersonalForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        className="mt-4"
        emailDuplicate={isEmailDuplicate}
      />
    </div>
  );
}
