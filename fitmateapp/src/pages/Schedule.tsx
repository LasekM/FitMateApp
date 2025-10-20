import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarTheme.css";
import type { Plan } from "../types/plan";
import type { ScheduledWorkout } from "../types/schedule";
import AddWorkoutModal from "../components/AddWorkoutModal";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function SchedulePage() {
  const [scheduledWorkouts, setScheduledWorkouts] = useState<
    ScheduledWorkout[]
  >([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Value>(new Date());
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null
  );
  const [editingWorkout, setEditingWorkout] = useState<ScheduledWorkout | null>(
    null
  );
  const [selectedDayForDisplay, setSelectedDayForDisplay] = useState<Date>(
    new Date()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [workoutsData, plansData] = await Promise.all([
          apiService.getScheduledWorkouts(),
          apiService.getPlans(),
        ]);

        setScheduledWorkouts(workoutsData);
        setPlans(plansData);
      } catch (err) {
        console.error("Failed to load data from API:", err);
        setError("Failed to load schedule data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    setSelectedDayForDisplay(new Date());
  }, []);

  const handleDayClick = (date: Date) => {
    setSelectedDayForDisplay(date);
  };

  const handleAddWorkoutClick = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDateForModal(date);
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const handleEditWorkout = (workoutToEdit: ScheduledWorkout) => {
    setEditingWorkout(workoutToEdit);
    setSelectedDateForModal(null);
    setIsModalOpen(true);
  };

  const handleDeleteWorkout = async (workoutId: number) => {
    const confirmed = confirm("Are you sure you want to delete this workout?");
    if (confirmed) {
      try {
        await apiService.deleteScheduledWorkout(workoutId);

        setScheduledWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
      } catch (err) {
        console.error("Failed to delete workout:", err);
        alert("Error: Could not delete workout.");
      }
    }
  };

  const handleSaveWorkout = async (workout: ScheduledWorkout) => {
    try {
      if (editingWorkout) {
        await apiService.updateScheduledWorkout(workout);

        setScheduledWorkouts((prev) =>
          prev.map((w) => (w.id === workout.id ? workout : w))
        );
      } else {
        const newWorkoutWithId = await apiService.addScheduledWorkout(workout);

        setScheduledWorkouts((prev) => [...prev, newWorkoutWithId]);
      }

      setIsModalOpen(false);
      setEditingWorkout(null);
    } catch (err) {
      console.error("Failed to save workout:", err);
      alert("Error: Could not save workout.");
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      const workoutsForDay = scheduledWorkouts.filter(
        (w) => w.date === dateString
      );

      return (
        <div className="relative h-full w-full flex flex-col justify-between items-center p-1">
          {workoutsForDay.length > 0 && (
            <div className="flex justify-center items-center gap-1 mt-auto mb-1">
              {workoutsForDay.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="h-3 w-3 bg-green-500 rounded-full"
                  title={`${w.planName} (${w.time})`}
                ></div>
              ))}
            </div>
          )}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => handleAddWorkoutClick(date, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAddWorkoutClick(date, e as any);
              }
            }}
            className="add-workout-button absolute top-1 text-white bg-green-600 hover:bg-green-700 rounded-full w-6 h-6 flex items-center justify-center transition-opacity duration-200 z-10 cursor-pointer"
            title="Add workout"
          >
            +
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedDay = selectedDayForDisplay;

  const workoutsForSelectedDay = selectedDay
    ? scheduledWorkouts
        .filter((w) => w.date === selectedDay.toISOString().split("T")[0])
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
    : [];

  if (isLoading) {
    return (
      <div className="p-6 text-white text-center text-xl">
        Loading your schedule... 🏋️
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center text-xl">Error: {error}</div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Schedule Your Workouts 📅</h1>
      <div className="calendar-container bg-zinc-800 p-4 rounded-xl">
        <Calendar
          onClickDay={handleDayClick}
          onChange={setCurrentDate}
          value={currentDate}
          tileContent={tileContent}
          className="react-calendar-theme"
          locale="en-US"
          calendarType="iso8601"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">
          Workouts for:{" "}
          {selectedDay
            ? selectedDay.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Select a day"}
        </h2>
        <div className="mt-4 space-y-3">
          {workoutsForSelectedDay.length > 0 ? (
            workoutsForSelectedDay.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg">
                    {workout.time ? `${workout.time} - ` : ""}
                    {workout.planName}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {workout.exercises.length} exercises
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditWorkout(workout)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-400">
              No workouts scheduled for this day. Click the '+' icon on a day in
              the calendar to add a new one.
            </p>
          )}
        </div>
      </div>

      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWorkout(null);
        }}
        onSave={handleSaveWorkout}
        date={selectedDateForModal}
        availablePlans={plans}
        initialWorkoutData={editingWorkout}
      />
    </div>
  );
}
