"use client";

import { Patient } from "@/type/patient";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import PersonalForm from "@/components/patient-form/personal-form";

type PresenceInfo = {
  presence_ref: string;
  status: string;
}

export default function RealtimeForm({
  serverPosts,
}: {
  serverPosts: Patient[];
}) {
  const [patientsData, setPatientData] = useState<Patient[]>(serverPosts);

  const supabase = createClient();

  // Realtime status updates
  useEffect(() => {
    const channel = supabase.channel("tracking", {
      config: { presence: { key: "staff" } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const patientStatus = [];

        for (const status in channel.presenceState()) {
          patientStatus.push((channel.presenceState()[status][0] as PresenceInfo).status);
        }

        console.log("patientStatus", patientStatus[0]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Realtime DB updates
  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "patients" },
        (payload) => {
          console.log("payload", { payload });
          setPatientData((prev) => [...prev, payload.new as Patient]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "patients" },
        (payload) => {
          setPatientData((prev) =>
            prev.map((item) =>
              item.id === (payload.old as Patient).id
                ? (payload.new as Patient)
                : item
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "patients" },
        (payload) => {
          console.log("delete", { payload });
          setPatientData((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col gap-16">
      {patientsData.map((p) => (
        <PersonalForm key={p.id} formData={p} />
      ))}
    </div>
  );
}
