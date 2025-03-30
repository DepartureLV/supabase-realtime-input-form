import PatientCard from "@/components/patient-card";
import { createClient } from "@/utils/supabase/client";

export default async function Patient() {
  const supabase = createClient();
  const { data } = await supabase
    .from("patients")
    .select("id, first_name, has_submitted");

  return (
    <div className="w-full">
      <h1 className="text-5xl font-extrabold text-primary">Patient List</h1>

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
