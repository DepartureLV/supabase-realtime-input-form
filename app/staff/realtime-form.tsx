"use client";

import { Patient } from "@/types/patient";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import PersonalForm from "@/components/personal-form";
import { OnlineStatus } from "@/types/online_status";
import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
      {patientsData.map((p) => (
        <PersonalForm key={p.id} formData={p} disabled />
      ))}
    </div>
  );
}

function OnlineBadge({ status }: { status: OnlineStatus }) {
  return (
    <AnimatePresence>
      <div className="w-fit h-8">
        {status === "inactive" && (
          <motion.div
            key="inactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 items-center text-yellow-400"
          >
            <div className="relative h-6 w-6">
              <div className="absolute h-full w-full bg-yellow-400 rounded-full z-10" />
              <div className="absolute h-full w-full bg-yellow-400 rounded-full animate-ping" />
            </div>
            <span>{status}</span>
          </motion.div>
        )}

        {status === "submitted" && (
          <motion.div
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 items-center"
          >
            <CircleCheck className="text-cyan-700" />
            <span>{status}</span>
          </motion.div>
        )}

        {status === "editing" && (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 items-center text-green-700"
          >
            <div className="relative h-6 w-6">
              <div className="absolute h-full w-full bg-green-700 rounded-full z-10" />
              <div className="absolute h-full w-full bg-green-700 rounded-full animate-ping" />
            </div>
            <span>{status}</span>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
