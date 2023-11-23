import React from 'react'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText, Badge, Modal } from '@mui/material'
import PolicyBack from '../img/PolicyBack.png';
import DrawPile from '../img/DrawPile.png'
import DiscardPile from '../img/DiscardPile.png'

export default function PolicyPiles({game, boardDimensions}) {
  // const horizontal = boardDimensions.x/35
  // const vertical = boardDimensions.x/3.3 //2.1
  const policyPilesWidth = boardDimensions.x/12
  const countStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    color:'#f5f5f5',
    backgroundColor: '#302F2F',
    fontFamily: 'inter',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: boardDimensions.x/35,
    height: boardDimensions.x/35,
    fontWeight: 'bold',
    borderRadius: boardDimensions.x/1800,
    fontSize: boardDimensions.x/48
  }
 //22.5, 9.5
 //27 32
  return (
      <Box sx={{display: 'flex', gap: 1}}>
        <Box sx={{position: 'absolute', left: boardDimensions.x/17.5, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
          <img src={DrawPile} style={{ width: '100%' }}/>
          <Box sx={{position: 'absolute', left: boardDimensions.x/95, bottom: boardDimensions.x/38, width: policyPilesWidth}}>
            <img src={PolicyBack} style={{ width: '100%' }}/>
            <Box sx={countStyles}>
              {game.deck.drawPile.length}
            </Box>
        </Box>
          </Box>
        <Box sx={{position: 'absolute', right: boardDimensions.x/17.5, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
          <img src={DiscardPile} style={{ width: '100%' }}/>
          <Box sx={{position: 'absolute', left: boardDimensions.x/95, bottom: boardDimensions.x/38, width: policyPilesWidth}}>
            <img src={PolicyBack} style={{ width: '100%' }}/>
            <Box sx={countStyles}>
              {game.deck.discardPile.length}
            </Box>
          </Box>
        </Box>
      </Box>
  )
}
