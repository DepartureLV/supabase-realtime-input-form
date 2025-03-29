"use client";

import { Patient } from "@/type/patient";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import PersonalForm from "@/components/personal-form";
import { OnlineStatus } from "@/type/online_status";
import { CircleCheck } from "lucide-react";

type PresenceInfo = {
  presence_ref: string;
  user: string;
  id: string;
  status: OnlineStatus;
};

export default function RealtimeForm({
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
        console.log(patientStatus);
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
      <div className="w-full flex justify-end">
        <OnlineBadge status={status} />
      </div>
      {patientsData.map((p) => (
        <PersonalForm key={p.id} formData={p} disabled />
      ))}
    </div>
  );
}

function OnlineBadge({ status }: { status: OnlineStatus }) {
  if (status === "inactive") {
    return (
      <div className="flex gap-2 items-center">
        <div className="h-6 w-6 bg-yellow-700 rounded-full" />
        <span>{status}</span>
      </div>
    );
  }

  if (status === "submit") {
    return (
      <div className="flex gap-2 items-center">
        <CircleCheck className="text-cyan-700" />
        <span>{status}</span>
      </div>
    );
  }

  if (status === "editing") {
    return (
      <div className="flex gap-2 items-center">
        <div className="h-6 w-6 bg-green-700 rounded-full" />
        <span>{status}</span>
      </div>
    );
  }

  return;
}
