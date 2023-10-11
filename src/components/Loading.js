import React from 'react'
import {Box, CircularProgress} from '@mui/material'

export default function Loading() {
  return (
    <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <CircularProgress size={100} sx={{color: 'white'}} />
    </Box>
  )
}
