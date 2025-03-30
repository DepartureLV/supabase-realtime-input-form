import { createClient } from "@/utils/supabase/client";
import PatientForm from "../patient-form";

export default async function Patient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  const { data } = await supabase.from("patients").select("*").eq("id", slug);

  return (
    <div className="w-full">
      <PatientForm id={slug} defaultValue={data ?? []} />
    </div>
  );
}
