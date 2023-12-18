import * as React from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import NonHostGameSettings from "./NonHostGameSettings";

export default function GameSettingsDialog({ game, gameSettingsOpen, setGameSettingsOpen }) {
  return (
    <Dialog
      open={gameSettingsOpen}
      onClose={() => setGameSettingsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <NonHostGameSettings game={game} />
      </DialogContent>
      {/* <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <DialogActions>
          <Button onClick={() => setGameSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </DialogActions> */}
    </Dialog>
  );
}
