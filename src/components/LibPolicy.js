import React from 'react'
import { Card, Box, CardContent, Typography } from '@mui/material'

export default function LibPolicy() {
  return (
      <Box sx={{backgroundColor: 'beige', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{backgroundColor: 'blue', width: '90%', height: '90%', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Card sx={{backgroundColor: 'beige', width: '85%', height: '85%', borderRadius: '5px'}}>
            <CardContent sx={{display: 'flex', fontSize: '20px', flexDirection: 'column', alignItems: 'center', minHeight: '100%'}}>
              🕊️
              <Typography sx={{color: 'blue', fontWeight: 'bold', borderBottom: '2px solid blue'}}>LIBERAL</Typography>
            </CardContent>
          </Card>
        </Box>
    </Box>
  )
}
