import { Stops } from "./Stops";

export const Tour = ({ tour }) => {
  const handleAddStop = () => {
    // dispatch(addStopLocal({ tourId: tour.id }));
  };

  return (
    <div key={tour.id} className="rounded-lg  ">
      <h2>Tour: {tour.name}</h2>
      <Stops stops={tour.stops} tourId={tour.id} />
      <button
        onClick={handleAddStop}
        className="w-full my-1.5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Add Stop
      </button>
    </div>
  );
};
