import { UserRound } from "lucide-react";
import Link from "next/link";

export default function PatientCard({
  id,
  name,
  user,
  submitted,
}: {
  id: string;
  name?: string | null;
  user: "patients" | "staff";
  submitted?: boolean;
}) {
  return (
    <Link href={`/${user}/${id}`} key={id}>
      <div className="group relative text-primary-foreground h-20 md:h-40 rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/25 shadow-primary/25 transition-all px-8 py-4">
        <div className="absolute -mx-8 -my-4 rounded-xl w-full h-full group-hover:rotate-2 bg-primary transition-all duration-300" />
        <div className="absolute -mx-8 -my-4 rounded-xl w-full h-full bg-white" />
        <div className="relative h-full flex items-center justify-between gap-4 text-primary z-10">
          <div className="flex flex-col justify-between h-full p-0 md:py-4 flex-1 w-full overflow-hidden">
            <h2 className="w-full inline-block text-wrap text-xl md:text-3xl font-bold overflow-hidden text-ellipsis">
              {name || "untitled"}
            </h2>
            {submitted && (
              <div className="flex gap-2 items-center">
                <div className="bg-green-700 w-4 h-4 rounded-full" />
                <p className="w-full overflow-hidden text-ellipsis flex-1">
                  Submitted
                </p>
              </div>
            )}
          </div>

          <div className="h-full aspect-square rounded-full bg-primary flex justify-center items-center p-2 md:p-8">
            <UserRound className="text-white h-full w-full group-hover:scale-125 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
