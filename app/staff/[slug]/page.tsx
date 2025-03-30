import { createClient } from "@/utils/supabase/client";
import RealtimeForm from "../realtime-form";

export default async function Patient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  const { data } = await supabase.from("patients").select("*").eq("id", slug);

  console.log("data of id", slug, "is", data);

  return (
    <div className="w-full">
      <RealtimeForm serverPosts={data ?? []} />
    </div>
  );
}
