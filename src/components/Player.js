import React from 'react'
import {CardHeader, Paper, List, Card, ListItemButton, Grid, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText } from '@mui/material'

import hitlerPng from '../img/Hitler.png'
import liberalPng from '../img/Liberal.png'
import fascistPng from '../img/Fascist.png'
import roleBackPng from '../img/RoleBack.png'
import libParty from '../img/LibParty.png'
import fascParty from '../img/FascParty.png'
import ja from '../img/Ja.png'
import nein from '../img/Nein.png'

//card height to width ratio = 1.36
//visibity: hidden

export default function Player({game}) {
  const roleImg = nein
  const numPlayers = 10
  const arr = []
  for(let i = 0; i < numPlayers; i++){
    arr.push(i)
  }

  const toRender = arr.map(i => {
    return (
    <Grid item xs={12/numPlayers} sx={{}}>
    <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <Typography sx={{fontSize: '10px'}}>1. Ari</Typography>
      <Card sx={{display: 'flex'}}>
          <img src={roleImg} style={{opacity: 1, maxWidth: "100%", maxHeight: "calc(100vh - 64px)" }}/>
      </Card>
    </Box>
  </Grid>
    )
  })
  return (
    <Box sx={{width: 500, height: 500, border: '2px solid black'}}>

      <Grid container spacing={1}>
        {toRender}
      </Grid>

    </Box>
  )
}
