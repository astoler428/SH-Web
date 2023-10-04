import React from 'react'
import { Card, Box, CardContent, Typography } from '@mui/material'
import { Vote } from '../consts'
export default function VoteCard({vote}) {
  return (
    <>
    {vote === Vote.JA ?
      <Box sx={{backgroundColor: 'beige', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{backgroundColor: 'black', width: '90%', height: '90%', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Card sx={{backgroundColor: 'beige', width: '90%', height: '90%', borderRadius: '5px'}}>
            <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100%' }}>
              <Typography sx={{color: 'black', fontWeight: 'bold', fontFamily: 'Luminari', fontSize: '50px', transform: 'rotate(90deg)'}}>ja!</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box> :
      <Box sx={{backgroundColor: 'beige', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Card sx={{backgroundColor: 'black', width: '85%', height: '85%', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100%' }}>
            <Typography sx={{color: 'beige', fontWeight: 'bold', fontFamily: 'Luminari', fontSize: '38px', transform: 'rotate(90deg)', letterSpacing: '1.5px'}}>nein!</Typography>
          </CardContent>
      </Card>
    </Box>

    }
    </>

  )
}
