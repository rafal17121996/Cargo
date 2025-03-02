import PropTypes from "prop-types";
import GradientBox from "../Box/Gradientbox";

const AuthContainer = ({ children }) => (
  <GradientBox
    center
    gradient="linear-gradient(145deg, #4f46e5, #6366f1)"
    sx={{
      minHeight: "100vh",
      p: 2,
    }}
  >
    <GradientBox
      elevation={24}
      gradient="linear-gradient(145deg, #ffffff, #f9f9f9)"
      sx={{
        maxWidth: 400,
        width: "100%",
        p: 4,
        borderRadius: 3,
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
        hoverEffect: {
          boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {children}
    </GradientBox>
  </GradientBox>
);

AuthContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContainer;
