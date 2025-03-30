export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/client";
import RealtimeCardList from "./components/realtime-card-list";

export default async function Patient() {
  const supabase = createClient();
  const { data } = await supabase.from("patients").select();

  return (
    <div className="w-full">
      <RealtimeCardList serverPosts={data ?? []} />
    </div>
  );
}
