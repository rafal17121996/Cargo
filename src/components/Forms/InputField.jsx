// components/Forms/InputField.jsx
import { TextField, InputAdornment } from '@mui/material';

import PropTypes from 'prop-types';

const InputField = ({ 
  icon, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  ...props 
}) => (
  <TextField
    fullWidth
    label={label}
    type={type}
    variant="outlined"
    margin="normal"
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          {icon}
        </InputAdornment>
      ),
      sx: {
        borderRadius: 2,
        "&:hover": { backgroundColor: "action.hover" },
      },
    }}
    {...props}
  />
);

InputField.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    };

export default InputField;