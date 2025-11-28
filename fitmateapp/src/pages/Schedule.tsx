import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarTheme.css";
import type { Plan as PlanForm } from "../types/plan";
import type { ScheduledWorkout as ScheduleForm } from "../types/schedule";
import AddWorkoutModal from "../components/AddWorkoutModal";
import { ScheduledService, PlansService } from "../api-generated";
import type {
  ScheduledDto,
  PlanDto,
  CreateScheduledDto,
} from "../api-generated";
import { toast } from "react-toastify";
import { ConfirmToast } from "../components/ConfirmToast";
import { toDateOnly } from "../utils/dateUtils";



type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function SchedulePage() {
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledDto[]>(
    []
  );
  const [plans, setPlans] = useState<PlanDto[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Value>(new Date());
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null
  );
  const [editingWorkout, setEditingWorkout] = useState<ScheduleForm | null>(
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
          ScheduledService.getApiScheduled(),
          PlansService.getApiPlans({}),
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

  const mapApiPlansToFormPlans = (apiPlans: PlanDto[]): PlanForm[] => {
    return apiPlans.map((p) => ({
      id: p.id || "",
      name: p.planName || "Untitled",
      type: p.type || "No Type",
      description: p.notes || "",
      exercises: (p.exercises as any) || [],
    }));
  };

  const handleEditWorkout = (workoutFromApi: ScheduledDto) => {
    if (!workoutFromApi.id) return;

    const workoutForForm: ScheduleForm = {
      id: workoutFromApi.id,
      date: workoutFromApi.date ? toDateOnly(new Date(workoutFromApi.date)) : new Date().toISOString().split("T")[0],
      time: workoutFromApi.time || undefined,
      planId: workoutFromApi.planId || "",
      planName: workoutFromApi.planName || "No Name",
      exercises: (workoutFromApi.exercises as any) || [],
      status: (workoutFromApi.status as any) || "planned",
      visibleToFriends: false,
    };
    setEditingWorkout(workoutForForm);
    setSelectedDateForModal(null);
    setIsModalOpen(true);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    const deleteAction = async () => {
      try {
        await ScheduledService.deleteApiScheduled({ id: workoutId });
        setScheduledWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
        toast.success("Workout deleted!"); // ZMIANA
      } catch (err) {
        console.error("Failed to delete workout:", err);
        toast.error("Error: Could not delete workout.");
      }
    };

    toast.warning(
      <ConfirmToast
        message="Are you sure you want to delete this workout?"
        onConfirm={deleteAction}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "dark",
      }
    );
  };

  const handleSaveWorkout = async (formData: ScheduleForm) => {
    try {
      const requestBody: CreateScheduledDto = {
        date: formData.date, // Use string directly to avoid timezone issues
        time: formData.time || null,
        planId: formData.planId,
        planName: formData.planName,
        notes: "",
        exercises: formData.exercises as any,
        status: formData.status,
      };

      console.log("Saving workout with body:", requestBody);

      if (editingWorkout) {
        await ScheduledService.putApiScheduled({
          id: editingWorkout.id,
          requestBody: requestBody,
        });
      } else {
        await ScheduledService.postApiScheduled({
          requestBody: requestBody,
        });
      }

      const updatedWorkouts = await ScheduledService.getApiScheduled();
      setScheduledWorkouts(updatedWorkouts);

      setIsModalOpen(false);
      setEditingWorkout(null);
      toast.success("Workout saved successfully!");
    } catch (err: any) {
      console.error("Failed to save workout:", err);
      const errorMessage = err.body?.message || err.message || "Unknown error";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleCompleteWorkout = async (workoutId: string) => {
    try {
      await ScheduledService.postApiScheduledComplete({
        id: workoutId,
        requestBody: {
          populateActuals: true,
        },
      });

      setScheduledWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId ? { ...w, status: "completed" } : w
        )
      );
      toast.success("Workout completed!");
    } catch (err: any) {
      // Check if the error message indicates the workout is already completed
      // The error object structure depends on the generated client, usually err.body or err.message
      const errorMessage = err.body?.message || err.message || JSON.stringify(err);
      
      if (errorMessage.includes("Trening jest już zakończony") || errorMessage.includes("already completed")) {
        console.warn("Backend says already completed, syncing UI to completed for ID:", workoutId);
        setScheduledWorkouts((prev) =>
          prev.map((w) =>
            w.id === workoutId ? { ...w, status: "completed" } : w
          )
        );
        toast.info("Workout was already completed. Updated status.");
      } else {
        console.error("Failed to complete workout. ID:", workoutId, "Error:", err);
        toast.error("Error: Could not complete workout.");
      }
    }
  };

  const handleUncompleteWorkout = async (workoutId: string) => {
    try {
      console.log("Undoing workout ID:", workoutId);

      await ScheduledService.postApiScheduledReopen({
        id: workoutId,
      });

      setScheduledWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId ? { ...w, status: "planned" } : w
        )
      );
      toast.info("Workout marked as planned.");
    } catch (err) {
      console.error("Failed to uncomplete workout. ID:", workoutId, "Error:", err);
      toast.error("Error: Could not revert workout status.");
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDayForDisplay(date);
  };

  const handleAddWorkoutClick = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDateForModal(date);
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = toDateOnly(date);
      const workoutsForDay = scheduledWorkouts.filter(
        (w) => w.date ? toDateOnly(new Date(w.date)) === dateString : false
      );

      const getDotColor = (workout: ScheduledDto) => {
        if (workout.status === "completed") return "bg-green-500";
        
        const wDate = new Date(workout.date!);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Create date object for comparison (ignoring time)
        const workoutDay = new Date(
          wDate.getFullYear(),
          wDate.getMonth(),
          wDate.getDate()
        );

        if (workoutDay < today) return "bg-red-500"; // Missed
        return "bg-yellow-500"; // Planned (Today or Future)
      };

      return (
        <div className="relative h-full w-full flex flex-col justify-between items-center p-1">
          {workoutsForDay.length > 0 && (
            <div className="flex justify-center items-center gap-1 mt-auto mb-1">
              {workoutsForDay.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className={`h-3 w-3 rounded-full ${getDotColor(w)}`}
                  title={`${w.planName} (${w.status})`}
                />
              ))}
            </div>
          )}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => handleAddWorkoutClick(date, e as any)}
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

  if (isLoading) {
    return <div className="p-6 text-white text-center text-xl">Loading...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-center text-xl">{error}</div>;
  }

  const selectedDay = selectedDayForDisplay;
  const workoutsForSelectedDay = selectedDay
    ? scheduledWorkouts
        .filter((w) => w.date ? toDateOnly(new Date(w.date)) === toDateOnly(selectedDay) : false)
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
            workoutsForSelectedDay.map((workout) => {
              const isCompleted = workout.status === "completed";
              const wDate = new Date(workout.date!);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const workoutDay = new Date(
                wDate.getFullYear(),
                wDate.getMonth(),
                wDate.getDate()
              );
              const isMissed = !isCompleted && workoutDay < today;


              let containerClass = "bg-zinc-800";
              let badge = null;

              if (isCompleted) {
                containerClass = "bg-green-900/30 border border-green-700";
                badge = (
                  <span className="ml-2 text-sm bg-green-600 text-white px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                );
              } else if (isMissed) {
                containerClass = "bg-red-900/30 border border-red-700";
                badge = (
                  <span className="ml-2 text-sm bg-red-600 text-white px-2 py-0.5 rounded-full">
                    Missed
                  </span>
                );
              } else {
                containerClass = "bg-yellow-900/30 border border-yellow-700";
                badge = (
                  <span className="ml-2 text-sm bg-yellow-600 text-white px-2 py-0.5 rounded-full">
                    Planned
                  </span>
                );
              }

              return (
                <div
                  key={workout.id}
                  className={`p-4 rounded-lg flex justify-between items-center ${containerClass}`}
                >
                  <div>
                    <p className="font-bold text-lg">
                      {workout.time ? `${workout.time} - ` : ""}
                      {workout.planName}
                      {badge}
                    </p>
                  <p className="text-sm text-zinc-400">
                    {workout.exercises?.length || 0} exercises
                  </p>
                </div>
                <div className="flex space-x-2">
                  {workout.status !== "completed" &&
                    (() => {
                      const todayStr = toDateOnly(new Date());
                      // Fix: Handle ISO strings by converting to YYYY-MM-DD
                      const workoutDateStr = workout.date ? toDateOnly(new Date(workout.date)) : "";
                      return workoutDateStr <= todayStr;
                    })() && (
                      <button
                        onClick={() => handleCompleteWorkout(workout.id!)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                      >
                        Complete
                      </button>
                    )}

                  {workout.status === "completed" && (
                    <button
                      onClick={() => handleUncompleteWorkout(workout.id!)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg transition"
                      title="Mark as Planned (Undo)"
                    >
                      Undo
                    </button>
                  )}

                  <button
                    onClick={() => handleEditWorkout(workout)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteWorkout(workout.id!)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              );
            })
          ) : (
            <p className="text-zinc-400">
              No workouts scheduled for this day. Click the '+' icon on a day...
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
        dateString={selectedDateForModal ? toDateOnly(selectedDateForModal) : ""}
        availablePlans={mapApiPlansToFormPlans(plans)}
        initialWorkoutData={editingWorkout}
      />
    </div>
  );
}
