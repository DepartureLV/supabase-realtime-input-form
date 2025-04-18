"use client";

import { Patient } from "@/types/patient";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import PersonalForm from "@/components/personal-form";
import { OnlineStatus } from "@/types/online_status";
import OnlineBadge from "./online-badge";

type PresenceInfo = {
  presence_ref: string;
  user: string;
  id: string;
  status: OnlineStatus;
};

export default function RealtimeStaffForm({
  serverPosts,
}: {
  serverPosts: Patient[];
}) {
  const [patientsData, setPatientData] = useState<Patient[]>(serverPosts);
  const [status, setStatus] = useState<OnlineStatus>("inactive");

  const supabase = createClient();

  // Realtime status updates
  useEffect(() => {
    const channel = supabase.channel("tracking", {
      config: { presence: { key: "staff" } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        let patientStatus: PresenceInfo[] = [];

        for (const status in channel.presenceState()) {
          patientStatus.push(
            channel.presenceState()[status][0] as PresenceInfo
          );
        }

        setStatus(patientStatus[0].status);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Realtime DB updates
  useEffect(() => {
    const channel = supabase
      .channel("db-changes-info")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "patients" },
        (payload) => {
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
      <div className="w-full flex flex-col justify-center items-end gap-2">
        <span className="font-semibold">Patient status </span>
        <OnlineBadge status={status} />
      </div>

      <PersonalForm
        key={patientsData[0].id}
        formData={patientsData[0]}
        disabled
      />
    </div>
  );
}
