import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const GradientButton = ({ 
  children, 
  color = 'primary', 
  active = true,
  ...props 
}) => {
  const gradients = {
    primary: 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)',
    secondary: 'linear-gradient(45deg, #ec4899 30%, #f472b6 90%)',
    error: 'linear-gradient(45deg, #ef4444 30%, #f87171 90%)',
    success: 'linear-gradient(45deg, #10b981 30%, #34d399 90%)'
  };

  const hoverShadows = {
    primary: '0 5px 15px rgba(79, 70, 229, 0.3)',
    secondary: '0 5px 15px rgba(236, 72, 153, 0.3)',
    error: '0 5px 15px rgba(239, 68, 68, 0.3)',
    success: '0 5px 15px rgba(16, 185, 129, 0.3)'
  };

  return (
    <Button
      variant="contained"
      sx={{
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        background: active ? gradients[color] : 'transparent',
        fontWeight: 600,
        letterSpacing: 0.5,
        position: 'relative',
        overflow: 'hidden',
        color: active ? 'white' : 'text.primary',
        '&:hover': {
          transform: active ? 'translateY(-1px)' : 'none',
          boxShadow: active ? hoverShadows[color] : 'none',
          background: active ? gradients[color] : 'rgba(0, 0, 0, 0.05)',
          '&::before': {
            opacity: active ? 0.1 : 0
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.2)',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

GradientButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'success']),
  active: PropTypes.bool,
  sx: PropTypes.object

};

export default GradientButton;