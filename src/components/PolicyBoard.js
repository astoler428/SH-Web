import React from 'react'
import { Card, Box, CardContent, Typography } from '@mui/material'
import Tracker from './Tracker'
import LibPolicy from './LibPolicy'
import FascPolicy from './FascPolicy'

export default function PolicyBoard({blues, reds}) {
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        {[1,2,3,4,5].map(i => {
          if(i <= blues){
            return <Box sx={{border: '2px solid black', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <LibPolicy/>
            </Box>
          }
          else{
            return <Box sx={{border: '2px solid black', fontSize: '60px', backgroundColor: 'lightblue', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {i === 5 ? '🕊️' : ''}
            </Box>
          }
        })}
      </Box>

      <Tracker/>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        {[1,2,3,4,5,6].map(i => {
          if(i <= reds){
            return <Box sx={{border: '2px solid black', width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <FascPolicy/>
            </Box>
          }
          else{
            return <Box sx={{border: '2px solid black', fontSize: '60px', backgroundColor: `${i > 3 ? 'darkred' : 'red'}`, width: '100px', height: '138px' , borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {i === 6 ? '💀' : ''}
            </Box>
          }
        })}
      </Box>
</>

  )
}
