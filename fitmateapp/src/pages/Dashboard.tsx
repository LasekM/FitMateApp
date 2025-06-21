import MotivationalQuote from "../components/MotivationalQuote";
import CalendarView from "../components/CalendarView";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-6 min-h-screen">
      {/* Last Workout */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-2 min-h-[300px] flex flex-col justify-center items-center">
        <h3 className="text-3xl mt-2 font-semibold mb-2">Last Workout</h3>
        <p className="text-lg">Chest & Triceps - 45 mins - 420 kcal</p>
      </div>

      {/* Calories */}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-1 min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Calories Burned</h2>
          <p className="text-5xl mt-2">3,240</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-700 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-2 min-h-[300px] flex flex-col justify-start items-center">
        <h3 className="text-3xl mt-2 font-semibold mb-4">Your Active Days</h3>
        <div className="w-full h-full flex items-start justify-center rounded-2xl overflow-hidden">
          <CalendarView />
        </div>
      </div>

      {/* Progress chart */}
      <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-2 min-h-[300px] flex flex-col justify-center items-center">
        <h3 className="text-3xl font-semibold mb-4">Weekly Progress</h3>
        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl">
          <span className="text-gray-400">[Chart Here]</span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-1 min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Weight stats</h2>
          <p className="text-5xl mt-2">75kg</p>
          <p className="text-2xl mt-2">chart and compare to our goal</p>
        </div>
      </div>

      {/* Quote */}
      <MotivationalQuote />
    </div>
  );
};

export default Dashboard;
