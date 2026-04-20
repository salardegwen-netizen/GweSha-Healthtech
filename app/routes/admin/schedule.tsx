import CalendarView from "~/components/admin/CalendarView";
import ScheduleView from "~/components/admin/ScheduleView";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function AdminSchedule() {
  const [view, setView] = useState<"calendar" | "list">("calendar");

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={view === "calendar" ? "default" : "outline"}
          onClick={() => setView("calendar")}
          className={`rounded-lg text-xs font-bold ${view === "calendar" ? "bg-[#00605A] hover:bg-[#004f4a]" : ""}`}
        >
          <span className="material-symbols-outlined text-[1.125rem]">calendar_month</span>
          Calendar
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          onClick={() => setView("list")}
          className={`rounded-lg text-xs font-bold ${view === "list" ? "bg-[#00605A] hover:bg-[#004f4a]" : ""}`}
        >
          <span className="material-symbols-outlined text-[1.125rem]">list</span>
          List View
        </Button>
      </div>

      {view === "calendar" ? <CalendarView /> : <ScheduleView />}
    </div>
  );
}

