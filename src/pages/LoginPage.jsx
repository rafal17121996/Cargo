import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Person, Lock } from "@mui/icons-material";
import { useLoginForm } from "../hooks/useLoginForm";
import AuthContainer from "../components/Auth/AuthContainer";
import GradientTitle from "../components/Common/GradientTitle";
import InputField from "../components/Forms/InputField";
import GradientButton from "../components/Buttons/GradientButton";
import { CircularProgress } from "@mui/material";
import { useToast } from "../hooks/useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

const LoginPage = () => {
  const navigate = useNavigate();
  const { credentials, handleChange } = useLoginForm();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response || response.status !== 200) {
        showToast("Invalid credentials or server error", TOAST_SEVERITY.ERROR);
        return;
      }

      const userData = response.data;
      sessionStorage.setItem("userData", JSON.stringify(userData));

      navigate(userData.role === "Dispatcher" ? "/dispatcher" : "/driver");
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Invalid credentials or server error",
        TOAST_SEVERITY.ERROR
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <GradientTitle>Cargo Meldung App</GradientTitle>
      <form onSubmit={handleLogin}>
        <InputField
          icon={<Person color="action" />}
          label="Username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
        <InputField
          icon={<Lock color="action" />}
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <GradientButton
          fullWidth
          sx={{ mt: 3 }}
          type="submit"
          disabled={isLoading}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {isLoading ? "Logging in..." : "Login"}
        </GradientButton>
      </form>
    </AuthContainer>
  );
};

export default LoginPage;
