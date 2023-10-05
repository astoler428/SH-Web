import React from 'react'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText, Badge } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import fasc5PlayerBoard from '../img/fasc5PlayerBoard.png'
import fasc7PlayerBoard from '../img/fasc7PlayerBoard.png'
import fasc9PlayerBoard from '../img/fasc9PlayerBoard.png'
import libBoard from '../img/libBoard.png'
import libPolicy from '../img/LibPolicy.png'
import fascPolicy from '../img/FascPolicy.png'
import PolicyBack from '../img/PolicyBack.png';

const boardWidth = 600
const boardLeft = 0
const boardBottom = 0
const fascBottom = 280 + boardBottom
const fascLeft = 57 + boardLeft
const libBottom = 62 + boardBottom
const libLeft = 101 + boardLeft
const policyWidth = 76
const trackerBottom = 30.5
const trackerGap = 55.5
const trackerLeft = 202.5
const deckBottom = 0
const deckLeft = 600


export default function Board({game}) {
  const fascBoard = game.players < 7 ? fasc5PlayerBoard : game.players < 9 ? fasc7PlayerBoard : fasc9PlayerBoard

  game.LibPoliciesEnacted = 3
  game.FascPoliciesEnacted = 3

  const fascPolicies = []
  for(let i = 0; i < game.FascPoliciesEnacted; i++){
    fascPolicies.push(<img src={fascPolicy} style={{ width: policyWidth }}/>)
  }
  const libPolicies = []
  for(let i = 0; i < game.LibPoliciesEnacted; i++){
    libPolicies.push(<img src={libPolicy} style={{ width: policyWidth }}/>)
  }

  return (
    <>
      <Box sx={{width: boardWidth, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'absolute', left: boardLeft, bottom: boardBottom}}>
        <img src={fascBoard} style={{ maxWidth: "100%" }}/>
        <img src={libBoard} style={{ maxWidth: "100%" }}/>

      </Box>
      <Box sx={{position: 'absolute', bottom: fascBottom, left: fascLeft, display: 'flex', gap: .7}}>
          {fascPolicies}
      </Box>
      <Box sx={{position: 'absolute', bottom: libBottom, left: libLeft, display: 'flex', gap: .7}}>
        {libPolicies}
      </Box>
      <CircleIcon sx={{color: 'blue', position: 'absolute', bottom: trackerBottom, left: trackerLeft + game.tracker * trackerGap}}/>
      <Box sx={{position: 'absolute', bottom: deckBottom, left: deckLeft, display: 'flex', flexDirection: 'column', gap: .2}}>

        <Box sx={{display: 'flex'}}>
          <img src={PolicyBack} style={{ width: policyWidth }}/>
          <Box sx={{position: 'relative', top: 0, left: -policyWidth, color: 'white', backgroundColor: 'black', textAlign: 'center', width: 25, height: 25, fontWeight: 'bold', fontSize: 18}}>{game.deck.drawPile.length}
          </Box>
        </Box>
        <Box sx={{display: 'flex'}}>
          <img src={PolicyBack} style={{ width: policyWidth }}/>
          <Box sx={{position: 'relative', top: 0, left: -policyWidth, color: 'white', backgroundColor: 'black', textAlign: 'center', width: 25, height: 25, fontWeight: 'bold', fontSize: 18}}>{game.deck.discardPile.length}
          </Box>
        </Box>
      </Box>


    </>
  )
}

