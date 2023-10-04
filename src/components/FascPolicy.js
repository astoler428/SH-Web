import React from 'react'
import { Card, Box, CardContent, Typography } from '@mui/material'

export default function FascPolicy() {
  return (
      <Box sx={{backgroundColor: 'beige', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{backgroundColor: 'red', width: '90%', height: '90%', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Card sx={{backgroundColor: 'beige', width: '85%', height: '85%', borderRadius: '5px'}}>
            <CardContent sx={{display: 'flex', flexDirection: 'column', fontSize: '20px', alignItems: 'center', minHeight: '100%'}}>
            💀
              <Typography sx={{color: 'red', fontWeight: 'bold', borderBottom: '2px solid red'}}>FASCIST</Typography>
            </CardContent>
          </Card>
        </Box>
    </Box>
  )
}