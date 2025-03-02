import { DailyTours } from "./components/DailyTours";
import { Navbar } from "./components/Navbar";

function DriverHomePage() {
  return (
    <div className="min-h-screen p-4">
      <Navbar />
      <DailyTours />
    </div>
  );
}

export default DriverHomePage;
