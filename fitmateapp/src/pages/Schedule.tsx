export default function Schedule() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Planning workouts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((day) => (
          <div key={day} className="bg-zinc-800 text-white p-4 rounded-xl">
            <h2 className="text-lg font-semibold">{day}</h2>
            <p className="text-sm text-zinc-400">No workout</p>
            <button className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white">
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
