import React from 'react'
import {Box, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Tracker({tracker}) {
  const bgColor0 = tracker === 0 ? 'blue' : ''
  const bgColor1 = tracker === 1 ? 'blue' : ''
  const bgColor2 = tracker === 2 ? 'blue' : ''
  const bgColor3 = tracker === 3 ? 'blue' : ''
  const radius='30px'
  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
      <Box sx={{backgroundColor: `${bgColor0}`, borderRadius: '100px', width: `${radius}`, height: `${radius}`, border: '2px solid black'}}></Box>
      <Typography>FAIL</Typography>
      <ArrowForwardIcon/>
      <Box sx={{backgroundColor: `${bgColor1}`, borderRadius: '100px', width: `${radius}`, height: `${radius}`, border: '2px solid black'}}></Box>
      <Typography>FAIL</Typography>
      <ArrowForwardIcon/>
      <Box sx={{backgroundColor: `${bgColor2}`, borderRadius: '100px', width: `${radius}`, height: `${radius}`, border: '2px solid black'}}></Box>
      <Typography>FAIL</Typography>
      <ArrowForwardIcon/>
      <Box sx={{backgroundColor: `${bgColor3}`, borderRadius: '100px', width: `${radius}`, height: `${radius}`, border: '2px solid black'}}></Box>
      <Typography  sx={{width: '150px'}}>REVEAL & PASS TOP POLICY</Typography>

    </Box>
  )
}
