export const DatePickre = ({ selectedDate, setSelectedDate }) => {
  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="date-picker"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Wybierz datę:
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={handleChange}
        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
};