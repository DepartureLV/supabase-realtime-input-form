import { createClient } from "@/utils/supabase/client";
import RealtimeForm from "../realtime-form";
import BackButton from "@/components/back-button";

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
      <BackButton />
      <RealtimeForm serverPosts={data ?? []} />
    </div>
  );
}
