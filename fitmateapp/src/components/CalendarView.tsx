import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarTheme.css";
import type { ScheduledWorkout } from "../types/schedule";

export default function CalendarView() {
  const [scheduledWorkouts, setScheduledWorkouts] = useState<
    ScheduledWorkout[]
  >([]);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem("scheduledWorkouts");
    if (savedWorkouts) {
      setScheduledWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      const workoutsForDay = scheduledWorkouts.filter(
        (w) => w.date === dateString
      );

      return (
        <div className="relative h-full w-full flex flex-col items-center justify-end p-1">
          {workoutsForDay.length > 0 && (
            <div className="flex justify-center items-center gap-1 mt-auto mb-10">
              {workoutsForDay.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="h-2 w-2 bg-green-500 rounded-full"
                  title={`${w.planName} (${w.time})`}
                ></div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full calendar-container-small">
      <Calendar
        value={new Date()}
        tileContent={tileContent}
        className="react-calendar-theme pointer-events-none"
        locale="en-US"
        showNavigation={false}
        calendarType="iso8601"
      />
    </div>
  );
}
