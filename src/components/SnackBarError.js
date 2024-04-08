import React from "react";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SnackBarError({ error, setError }) {
  const handleClose = () => setError(null);

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return <Snackbar open={error !== null} onClose={handleClose} message={error} autoHideDuration={5000} action={action} />;
}
