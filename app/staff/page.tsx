import PatientCard from "@/components/patient-card";
import { createClient } from "@/utils/supabase/client";
import RealtimeCardList from "./realtime-card-list";

export default async function Patient() {
  const supabase = createClient();
  const { data } = await supabase.from("patients").select();

  return (
    <div className="w-full">
      <RealtimeCardList serverPosts={data ?? []} />
    </div>
  );
}
