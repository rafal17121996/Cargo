import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import useUserData from "../../../../hooks/useUserData";

export const Navbar = () => {
  const navigate = useNavigate();
  const { userData, clearUserData } = useUserData();
  const handleLogout = async () => {
    await updateUserOnlineStatus(false);
    clearUserData();
    navigate("/");
  };

  const updateUserOnlineStatus = async (status) => {
    if (!userData || !userData.id) {
      return;
    }
    try {
      await api.put(`/users/${userData.id}`, { is_online: status });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-bold text-gray-800">
        Hello {userData.first_name} {userData.last_name}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};
