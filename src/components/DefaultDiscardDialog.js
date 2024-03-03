import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Color, Status } from "../consts";
import { inGov, claiming } from "../helperFunctions";
import libPolicyPng from "../img/LibPolicy.png";
import fascPolicyPng from "../img/FascPolicy.png";

export default function DefaulDiscardDialog({ game, name, showDiscardDialog, setShowDiscardDialog, presDiscard, boardDimensions }) {
  const policyWidth = boardDimensions.x / 7.8;
  // const policyBorderRadius = policyWidth / 18

  function getPolicyImg(card) {
    return card?.color === Color.RED ? fascPolicyPng : libPolicyPng;
  }

  return (
    <div>
      <Dialog
        open={showDiscardDialog && !(inGov(game, name) || game.status === Status.CHAN_CLAIM || claiming(game, name))}
        onClose={() => setShowDiscardDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ justifyContent: "center", display: "flex" }}>
          {"Your discard"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={getPolicyImg(presDiscard)} draggable="false" style={{ width: "50%", marginBottom: "10px" }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
