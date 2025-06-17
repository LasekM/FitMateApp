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

  useEffect(() => {
    const savedWorkouts = localStorage.getItem("scheduledWorkouts");
    if (savedWorkouts) {
      const parsedWorkouts: ScheduledWorkout[] = JSON.parse(savedWorkouts);
      setScheduledWorkouts(parsedWorkouts);
    }
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
    setSelectedDayForDisplay(new Date());
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "scheduledWorkouts",
      JSON.stringify(scheduledWorkouts)
    );
  }, [scheduledWorkouts]);

  const handleDayClick = (date: Date) => {
    setSelectedDayForDisplay(date);
  };

  const handleAddWorkoutClick = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents onClickDay from being triggered
    setSelectedDateForModal(date);
    setEditingWorkout(null); // Ensure modal is in add mode
    setIsModalOpen(true);
  };

  const handleEditWorkout = (workoutToEdit: ScheduledWorkout) => {
    setEditingWorkout(workoutToEdit);
    setSelectedDateForModal(null); // Not used in edit mode, initialWorkoutData takes precedence
    setIsModalOpen(true);
  };

  const handleDeleteWorkout = (workoutId: number) => {
    const confirmed = confirm("Are you sure you want to delete this workout?");
    if (confirmed) {
      setScheduledWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
    }
  };

  const handleSaveWorkout = (workout: ScheduledWorkout) => {
    if (editingWorkout) {
      // Edit mode: find and update existing workout
      setScheduledWorkouts((prev) =>
        prev.map((w) => (w.id === workout.id ? workout : w))
      );
    } else {
      // Add mode: add new workout
      setScheduledWorkouts((prev) => [...prev, workout]);
    }
    setIsModalOpen(false);
    setEditingWorkout(null); // Always reset after save
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
          <button
            onClick={(e) => handleAddWorkoutClick(date, e)}
            className="add-workout-button absolute top-1 text-white bg-green-600 hover:bg-green-700 rounded-full w-6 h-6 flex items-center justify-center transition-opacity duration-200 z-10"
            title="Add workout"
          >
            +
          </button>
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
          locale="en-US" // Changed back to English
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
          setEditingWorkout(null); // Reset edit state when closing modal
        }}
        onSave={handleSaveWorkout}
        date={selectedDateForModal} // For add mode
        availablePlans={plans}
        initialWorkoutData={editingWorkout} // For edit mode
      />
    </div>
  );
}
