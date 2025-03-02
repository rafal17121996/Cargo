import { Typography } from '@mui/material';

import PropTypes from 'prop-types';
import { pinkGradient } from '../../theme/gradients';

const GradientTitle = ({ children, variant = "h4" }) => (
  <Typography
    variant={variant}
    sx={{
      mb: 4,
      textAlign: "center",
      fontWeight: 700,
      background: pinkGradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </Typography>
);

GradientTitle.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.string,
    };

export default GradientTitle;