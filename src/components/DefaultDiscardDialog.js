import React, {useState} from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { POLICY_WIDTH, Color } from '../consts';
import libPolicyPng from '../img/LibPolicy.png'
import fascPolicyPng from '../img/FascPolicy.png'

export default function DefaulDiscardDialog({showDiscardDialog, setShowDiscardDialog, presDiscard}) {

  function getPolicyImg(card){
    return card?.color === Color.RED ? fascPolicyPng : libPolicyPng
  }

  return (
    <div>
      <Dialog
        open={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"You discarded:"}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src={getPolicyImg(presDiscard)} draggable='false' style={{width: POLICY_WIDTH, borderRadius: '10px'}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscardDialog(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

