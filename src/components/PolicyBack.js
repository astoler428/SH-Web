import React from 'react'
import { Card, Box, CardContent, Typography } from '@mui/material'

export default function PolicyBack({count}) {
  return (
    <Box sx={{width: '300px', height: '300px'}}>
      <Box sx={{backgroundColor: 'beige', width: '100px', height: '138px', position: 'relative', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{position: 'absolute', left: 0, top: 0}}>
          <Typography sx={{backgroundColor: 'black', color: 'beige'}}>
            {count}
          </Typography>
        </Box>
        <Card sx={{backgroundColor: 'black', width: '75%', height: '75%', borderRadius: '5px'}}>
          <CardContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%'}}>
            <Typography sx={{color: 'beige', fontWeight: 'bold', borderBottom: '2px solid white'}}>POLICY</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
