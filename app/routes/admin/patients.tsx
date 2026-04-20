import { Badge } from "~/components/ui/badge";
import PatientTable from "~/components/admin/PatientTable";

export default function AdminPatients() {
  return (
    <div className="mt-8 relative">
      <Badge className="absolute -top-3 left-6 z-10 bg-[#00605A] text-white hover:bg-[#00605A] border-none px-4 shadow-md font-bold uppercase tracking-wider text-[0.6875rem]">
        Master Directory
      </Badge>
      <PatientTable />
    </div>
  );
}
