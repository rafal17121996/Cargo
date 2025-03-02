import { Box, Paper } from '@mui/material';
import PropTypes from 'prop-types';

const GradientBox = ({
  children,
  elevation,
  gradient,
  background,
  width,
  height,
  center,
  hoverEffect,
  border,
  shadow,
  padding,
  margin,
  borderRadius,
  transition,
  transform,
  position,
  overflow,
  zIndex,
  sx,
  ...props
}) => {
  const Component = elevation ? Paper : Box;

  return (
    <Component
      elevation={elevation}
      sx={{
        position: position || 'relative',
        background: gradient || background,
        width: width || 'auto',
        height: height || 'auto',
        border: border,
        boxShadow: shadow,
        p: padding,
        m: margin,
        borderRadius: borderRadius,
        transition: transition || 'all 0.3s ease',
        transform: transform,
        overflow: overflow,
        zIndex: zIndex,
        ...(center && {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }),
        '&:hover': hoverEffect,
        ...sx
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

GradientBox.propTypes = {
  children: PropTypes.node,
  elevation: PropTypes.number,
  gradient: PropTypes.string,
  background: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  center: PropTypes.bool,
  hoverEffect: PropTypes.object,
  border: PropTypes.string,
  shadow: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  transition: PropTypes.string,
  transform: PropTypes.string,
  position: PropTypes.string,
  overflow: PropTypes.string,
  zIndex: PropTypes.number,
  sx: PropTypes.object
};

export default GradientBox;