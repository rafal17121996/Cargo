export const DataWrapper = ({ loading, error, data, noDataText, children }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;
  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    !data.is_released
  ) {
    return <p>{noDataText}</p>;
  }
  return <>{children(data)}</>;
};
