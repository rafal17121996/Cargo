import { useState } from "react";

export const StopEdit = ({ stop, onSave }) => {
  const [formData, setFormData] = useState({
    order: stop.order,
    wb1: stop.wb1,
    wb2: stop.wb2,
    planned_arrival: stop.planned_arrival,
    planned_departure: stop.planned_departure,
    wb1_arrival: stop.wb1_arrival,
    wb2_arrival: stop.wb2_arrival,
    wb1_departure: stop.wb1_departure,
    wb2_departure: stop.wb2_departure,
    client_id: stop.client_id,
    actual_arrival: stop.actual_arrival,
    actual_departure: stop.actual_departure,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    onSave(stop.id, formData);
  };

  return (
    <div className="rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolumna dotycząca przyjazdu */}
        <div className="bg-gray-150 p-4 rounded-lg shadow-lg ">
          <label className="block text-sm font-medium text-gray-700">
            Planned Arrival
          </label>
          <input
            type="time"
            name="planned_arrival"
            value={formData.planned_arrival}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Actual Arrival
          </label>
          <input
            type="time"
            name="actual_arrival"
            value={formData.actual_arrival}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            WB1 Arrival
          </label>
          <input
            type="text"
            name="wb1_arrival"
            value={formData.wb1_arrival}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            WB2 Arrival
          </label>
          <input
            type="text"
            name="wb2_arrival"
            value={formData.wb2_arrival}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Kolumna dotycząca odjazdu */}
        <div className="bg-gray-150 p-4 rounded-lg shadow-lg ">
          <label className="block text-sm font-medium text-gray-700">
            Planned Departure
          </label>
          <input
            type="time"
            name="planned_departure"
            value={formData.planned_departure}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Actual Departure
          </label>
          <input
            type="time"
            name="actual_departure"
            value={formData.actual_departure}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            WB1 Departure
          </label>
          <input
            type="text"
            name="wb1_departure"
            value={formData.wb1_departure}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            WB2 Departure
          </label>
          <input
            type="text"
            name="wb2_departure"
            value={formData.wb2_departure}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            WB1
          </label>
          <input
            type="text"
            name="wb1"
            value={formData.wb1}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            WB2
          </label>
          <input
            type="text"
            name="wb2"
            value={formData.wb2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleSaveClick}
        className="mt-6 w-full rounded-md bg-blue-600 py-2 px-4 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save
      </button>
    </div>
  );
};