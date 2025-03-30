"use client";

import { createClient } from "@/utils/supabase/client";
import PatientCard from "@/components/patient-card";
import { useEffect, useState } from "react";
import { Patient } from "@/types/patient";

export default function RealtimeCardList({
  serverPosts,
}: {
  serverPosts: Patient[];
}) {
  const supabase = createClient();
  const [data, setData] = useState<Patient[]>(serverPosts);

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patients" },
        async (payload) => {
          const { data } = await supabase.from("patients").select();
          setData(data as Patient[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-full">
      <h1 className="text-5xl font-extrabold text-primary">Patient List</h1>

      {data?.length === 0 && (
        <p className="w-full text-center py-24">No data</p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {data?.map((patient) => (
          <li key={patient.id}>
            <PatientCard
              id={patient.id}
              name={patient.first_name}
              user={"staff"}
              submitted={patient.has_submitted}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
