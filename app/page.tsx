import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <h1 className="w-full text-center text-5xl p-0 m-0">Select Role</h1>
      <div className="flex gap-4">
        <a href="/patients" className="w-full">
          <Button className="w-full hover:bg-primary/70 transition-all duration-500 hover:-translate-y-2">
            Patient
          </Button>
        </a>
        <a href="/staff" className="w-full">
          <Button className="w-full hover:bg-primary/70 transition-all duration-500 hover:-translate-y-2 ">
            Staff
          </Button>
        </a>
      </div>
    </>
  );
}
