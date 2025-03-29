import { createClient } from "@/utils/supabase/client";
import RealtimeForm from "./realtime-form";

export default async function Patient() {
  const supabase = createClient();
  const { data } = await supabase.from("patients").select("*");

  return (
    <div className="w-full">
      <RealtimeForm serverPosts={data ?? []} />
    </div>
  );
}
