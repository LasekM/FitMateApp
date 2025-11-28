import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarTheme.css";
import { ScheduledService, type ScheduledDto } from "../api-generated";

import { toDateOnly } from "../utils/dateUtils";

export default function CalendarView() {
  const [workoutStatusMap, setWorkoutStatusMap] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setIsLoading(true);
        const data: ScheduledDto[] = await ScheduledService.getApiScheduled();

        const statusMap: Record<string, string> = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Group workouts by date
        const workoutsByDate: Record<string, ScheduledDto[]> = {};
        data.forEach((w) => {
          if (!w.date) return;
          if (!workoutsByDate[w.date]) {
            workoutsByDate[w.date] = [];
          }
          workoutsByDate[w.date].push(w);
        });

        // Determine status for each date
        Object.keys(workoutsByDate).forEach((dateStr) => {
          const workouts = workoutsByDate[dateStr];
          const dateObj = new Date(dateStr);
          const dateOnly = new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate()
          );

          const hasMissed = workouts.some(
            (w) => w.status !== "completed" && dateOnly < today
          );
          const hasPlanned = workouts.some(
            (w) => w.status !== "completed" && dateOnly >= today
          );
          const allCompleted = workouts.every((w) => w.status === "completed");

          if (hasMissed) {
            statusMap[dateStr] = "missed-day-tile";
          } else if (hasPlanned) {
            statusMap[dateStr] = "planned-day-tile";
          } else if (allCompleted) {
            statusMap[dateStr] = "completed-day-tile";
          }
        });

        setWorkoutStatusMap(statusMap);
      } catch (e) {
        console.error("Failed to load workouts for dashboard calendar", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadWorkouts();
  }, []);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = toDateOnly(date);
      const isToday = dateString === toDateOnly(new Date());

      if (isToday) return null;

      return workoutStatusMap[dateString] || null;
    }
    return null;
  };

  return (
    <div className="w-full calendar-container-small">
      {!isLoading && (
        <Calendar
          value={new Date()}
          tileClassName={tileClassName}
          className="react-calendar-theme pointer-events-none rounded-2xl"
          locale="en-US"
          showNavigation={false}
          calendarType="iso8601"
        />
      )}
    </div>
  );
}
