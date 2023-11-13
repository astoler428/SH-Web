import React, {useState} from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Color, inGov, claiming, Status } from '../consts';
import libPolicyPng from '../img/LibPolicy.png'
import fascPolicyPng from '../img/FascPolicy.png'


export default function DefaulDiscardDialog({game, name, showDiscardDialog, setShowDiscardDialog, presDiscard, boardDimensions}) {
  const policyWidth = boardDimensions.x / 8.2
  const policyBorderRadius = policyWidth / 18

  function getPolicyImg(card){
    return card?.color === Color.RED ? fascPolicyPng : libPolicyPng
  }

  return (
    <div>
      <Dialog
        open={showDiscardDialog && !(inGov(game, name) || game.status === Status.CHAN_CLAIM || claiming(game, name))}
        onClose={() => setShowDiscardDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You discarded:"}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src={getPolicyImg(presDiscard)} draggable='false' style={{width: '60%', borderRadius: policyBorderRadius}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscardDialog(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

