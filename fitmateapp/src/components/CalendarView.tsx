import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarTheme.css";
import { ScheduledService, type ScheduledDto } from "../api-generated";

const getFormattedDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function CalendarView() {
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setIsLoading(true);
        const data: ScheduledDto[] = await ScheduledService.getApiScheduled();

        const workoutDates = new Set(
          data.map((w: ScheduledDto) => w.date || "")
        );

        setActiveDays(workoutDates);
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
      const dateString = getFormattedDate(date);
      const isToday = dateString === getFormattedDate(new Date());

      if (isToday) return null;

      if (activeDays.has(dateString)) {
        return "active-day-tile";
      }
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
