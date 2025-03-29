"use client";

import PersonalForm from "@/components/personal-form";
import { OnlineStatus } from "@/type/online_status";
import { Patient } from "@/type/patient";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PatientForm() {
  const supabase = createClient();
  const statusRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<RealtimeChannel>(null);

  const id = uuidv4();

  const [formData, setFormData] = useState<Patient>({
    id: id,
    first_name: null,
    middle_name: null,
    last_name: null,
    date_of_birth: null,
    gender: null,
    phone_number: null,
    email: null,
    address: null,
    preferred_language: null,
    nationality: null,
    emergency_contact_name: null,
    emergency_contact_relationship: null,
    religion: null,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const first_name = formData.get("firstName");
    const middle_name = formData.get("middleName");
    const last_name = formData.get("lastName");
    const date_of_birth = formData.get("dateOfBirth");
    const gender = formData.get("gender");
    const phone_number = formData.get("phoneNumber");
    const email = formData.get("email");
    const address = formData.get("address");
    const preferred_language = formData.get("preferredLang");
    const nationality = formData.get("nationality");
    const emergency_contact_name = formData.get("emergencyContactName");
    const emergency_contact_relationship = formData.get(
      "emergencyContactRelationship"
    );
    const religion = formData.get("religion");

    const payload = {
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
    };

    const { data, error } = await supabase
      .from("patients")
      .upsert(payload, { onConflict: "email" })
      .eq("email", email)
      .select("*");

    if (error) {
      console.error("error", error);
      return;
    }

    console.log("data", data);
  };

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
    }, 3000);
  };

  return (
    <div className="w-full">
      Status: {userStatus} <br />
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
