import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDailyTours } from "../../../../slices/dailyToursSlice";
import { Tour } from "./Tour";
import { getDefaultDate } from "../../../../helpers/getDefaultDate";
import { DataWrapper } from "./DataWrapper";
import { DatePickre } from "./DatePickre";

export const DailyTours = () => {
  const dispatch = useDispatch();
  const { tours, loading, error } = useSelector((state) => state.dailyTours);
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());

  useEffect(() => {
    dispatch(fetchDailyTours(selectedDate));
  }, [dispatch, selectedDate]);

  const handleDateChange = useCallback((e) => {
    setSelectedDate(e.target.value);
  }, []);

  return (
    <DataWrapper
      loading={loading}
      error={error}
      data={tours}
      noDataText="No tours available."
    >
      {(data) => (
        <div style={{ padding: "1rem" }}>
          <DatePickre
            selectedDate={selectedDate}
            setSelectedDate={handleDateChange}
          />

          {data.map((tour) => (
            <Tour tour={tour} key={tour.id} />
          ))}
        </div>
      )}
    </DataWrapper>
  );
};
