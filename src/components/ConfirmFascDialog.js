import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { gameOver, throttle } from "../helperFunctions";
import useCustomThrottle from "../hooks/useCustomThrottle";

export default function ConfirmFascDialog({ game, confirmFascOpen, setConfirmFascOpen, handleConfirmFasc }) {
  React.useEffect(() => {
    if (gameOver(game.status)) {
      setConfirmFascOpen(false);
    }
  }, [game.status]);

  const throttledHandleConfirmFasc = useCustomThrottle(handleConfirmFasc);

  return (
    <div>
      <Dialog
        open={confirmFascOpen}
        onClose={() => setConfirmFascOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">If you are liberal, all the liberals lose.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmFascOpen(false)}>Nevermind</Button>
          <Button onClick={throttledHandleConfirmFasc} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
