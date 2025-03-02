import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import PropTypes from "prop-types";

function TempPasswordModal({ open, onClose, tempPassword }) {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(tempPassword);
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Temporary Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              {tempPassword}
            </Typography>
            <Button 
              variant="outlined"
              onClick={copyToClipboard}
              sx={{ textTransform: 'none' }}
            >
              Copy
            </Button>
          </Box>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This password will only be shown once! Make sure to save it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  TempPasswordModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    tempPassword: PropTypes.string.isRequired,
  };

  export default TempPasswordModal;