import PatientCard from "@/components/patient-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export default async function Patient() {
  const supabase = createClient();
  const { data } = await supabase.from("patients").select("id, first_name");

  const id = uuidv4();

  return (
    <div className="w-full">
      <h1 className="text-5xl font-extrabold text-primary"></h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {data?.map((patient) => (
          <li key={patient.id}>
            <PatientCard
              id={patient.id}
              name={patient.first_name}
              user={"patients"}
            />
          </li>
        ))}
      </ul>

      <a href={`/patients/${id}`} className="w-full">
        <Button className="w-full">New Patient</Button>
      </a>
    </div>
  );
}
