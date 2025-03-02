import { StopEdit } from "./StopEdit";
import useApi from "../../../../hooks/useApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateStop } from "../../../../slices/dailyToursSlice";
import { useToast } from "../../../../hooks/useToast";
import { TOAST_SEVERITY } from "../../../../utils/toastUtils";

export const Stops = ({ stops, tourId }) => {
  const { showToast } = useToast();
  const { execute } = useApi();
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  if (stops && stops.length === 0) return <p>No stops available.</p>;

  const handleSave = async (stopId, formData) => {
    try {
      const response = await execute({
        url: `/daily-tours/${tourId}/stops/${stopId}`,
        method: "PUT",
        payload: formData,
      });
      dispatch(updateStop({ tourId, stop: response }));
      showToast(
         "Info",
        TOAST_SEVERITY.SUCCESS
      );
    } catch (error) {
      console.error("Error updating stop", error);
    }
  };

  return (
    <div>
      {stops.map((stop) => (
        <div key={stop.id} className="bg-gray-150 p-4 rounded-lg shadow-lg">
          <div
            className="flex flex-col justify-between items-center cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <p className="text-xl font-bold mb-1">{stop.client.name}</p>
            <p className="text-sm text-gray-600">
              {`${stop.client.street} ${stop.client.house_number}, ${stop.client.postal_code} ${stop.client.city}, ${stop.client.country}`}
            </p>
          </div>
          {expanded && <StopEdit stop={stop} onSave={handleSave} />}
        </div>
      ))}
    </div>
  );
};
