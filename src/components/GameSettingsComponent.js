import React, {useEffect} from 'react'
import { Typography, Box, Container, FormGroup, Card, List, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, Button, CardContent, ListItem, ListItemText } from '@mui/material';
import { GameType, GameSettings } from '../consts';

export default function GameSettingsComponent({game, name, handleSettingsChange}) {

  const styles = {fontSize: 16,  fontWeight: 'normal', fontFamily: 'inter'}

  return (
    <>
    {game.host === name ?
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          maxWidth: 320
        }}>
      <FormControl fullWidth>
        <InputLabel id="game-type-label">Game Type</InputLabel>
        <Select
          labelId="game-type-label"
          value={game.settings.type}
          label="Game type"
          onChange={(e)=> handleSettingsChange(GameSettings.TYPE, e.target.value)}
          >
        <MenuItem value={GameType.BLIND}>{GameType.BLIND}</MenuItem>
        <MenuItem value={GameType.NORMAL}>{GameType.NORMAL}</MenuItem>
        <MenuItem value={GameType.LIB_SPY}>{GameType.LIB_SPY}</MenuItem>
        <MenuItem value={GameType.MIXED_ROLES}>{GameType.MIXED_ROLES}</MenuItem>
        </Select>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={<Checkbox
            checked={game.settings?.redDown}
            onChange={() => handleSettingsChange(GameSettings.REDDOWN)}
            />}
            label="Start with red down"
            />
        <FormControlLabel
          // disabled={game.settings?.type === GameType.BLIND}
          control={<Checkbox
            checked={game.settings?.hitlerKnowsFasc}
            onChange={() => handleSettingsChange(GameSettings.HITLERKNOWSFASC)}
            />}
            label="Hitler knows Fascists in 7+"
            />
        <FormControlLabel
          disabled={game.settings?.type !== GameType.BLIND}
          control={<Checkbox
            checked={game.settings?.simpleBlind}
            onChange={() => handleSettingsChange(GameSettings.SIMPLEBLIND)}
            />}
            label="Simple Blind"
            />
        {/* <FormControlLabel
          disabled={game.settings?.type !== GameType.LIB_SPY}
          control={<Checkbox
            checked={game.settings?.teamLibSpy}
            onChange={() => handleSettingsChange(GameSettings.TEAMLIBSPY)}
            />}
            label="Team Liberal spy condition"
            /> */}
        </FormGroup>
      </Box>
      :
       <Card>
          <List>
            <ListItem>
              <Typography variant='h6'>Game Type: <span style={styles}>{game.settings.type.toUpperCase()}</span></Typography>
              {/* <ListItemText primary={`Game Type: ${game.settings.type.toUpperCase()}`} /> */}
            </ListItem>
            <ListItem>
              <Typography variant='h6'>Start with red down: <span style={styles}>{game.settings.redDown ? 'YES' : 'NO'}</span></Typography>
            {/* <ListItemText primary={`Start with red down: ${game.settings.redDown ? 'YES' : 'NO'}`} /> */}
            </ListItem>
            <ListItem>
              <Typography variant='h6'>Hitler knows Fascists in 7+: <span style={styles}>{game.settings.hitlerKnowsFasc ? 'YES' : 'NO'}</span></Typography>
            {/* <ListItemText primary={`Hitler knows Fascists in 7+: ${game.settings.hitlerKnowsFasc ? 'YES' : 'NO'}`} /> */}
            </ListItem>
            <ListItem>
              <Typography variant='h6'>Simple blind: <span style={styles}>{game.settings.simpleBlind ? 'YES' : 'NO'}</span></Typography>
            {/* <ListItemText primary={`Simple blind: ${game.settings.simpleBlind ? 'YES' : 'NO'}`} /> */}
            </ListItem>
          </List>
      </Card>
  }
  </>
  )
}







