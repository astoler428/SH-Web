import React from "react";
import {
  Typography,
  Box,
  FormGroup,
  Card,
  List,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
} from "@mui/material";
import { GameType, GameSettings } from "../consts";
import Loading from "./Loading";

export default function GameSettingsComponent({ game, name, handleSettingsChange }) {
  const styles = { fontSize: 16, fontWeight: "normal", fontFamily: "inter" };
  if (game) {
    return (
      <>
        {game.host === name ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              maxWidth: 320,
              gap: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="game-type-label">Game Type</InputLabel>
              <Select
                labelId="game-type-label"
                value={game.settings.type}
                label="Game type"
                onChange={e => handleSettingsChange(GameSettings.TYPE, e.target.value)}
              >
                <MenuItem value={GameType.BLIND}>{GameType.BLIND}</MenuItem>
                <MenuItem value={GameType.NORMAL}>{GameType.NORMAL}</MenuItem>
                <MenuItem value={GameType.LIB_SPY}>{GameType.LIB_SPY}</MenuItem>
                <MenuItem value={GameType.MIXED_ROLES}>{GameType.MIXED_ROLES}</MenuItem>
              </Select>
            </FormControl>

            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={game.settings?.redDown} onChange={() => handleSettingsChange(GameSettings.REDDOWN)} />}
                label="Start with red down"
              />
              <FormControlLabel
                disabled={game.settings?.type === GameType.BLIND}
                control={<Checkbox checked={game.settings?.hitlerKnowsFasc} onChange={() => handleSettingsChange(GameSettings.HITLERKNOWSFASC)} />}
                label="Hitler knows fascists in 7+"
              />
              <FormControlLabel
                disabled={game.settings?.type !== GameType.BLIND}
                control={<Checkbox checked={game.settings?.simpleBlind} onChange={() => handleSettingsChange(GameSettings.SIMPLEBLIND)} />}
                label="Simple blind"
              />
              <FormControlLabel
                disabled={game.settings?.type !== GameType.BLIND}
                control={<Checkbox checked={game.settings?.cooperativeBlind} onChange={() => handleSettingsChange(GameSettings.COOPERATIVEBLIND)} />}
                label="Cooperative blind"
              />
              <FormControlLabel
                disabled={game.settings?.type !== GameType.BLIND}
                control={<Checkbox checked={game.settings?.completeBlind} onChange={() => handleSettingsChange(GameSettings.COMPLETEBLIND)} />}
                label="Complete blind"
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
        ) : (
          <Card sx={{ display: "flex", justifyContent: "center" }}>
            <List sx={{ fontWeight: "bold", margin: "6px 0" }}>
              <ListItem>
                <Typography variant="h7">
                  Game type: <span style={styles}>{game.settings.type}</span>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="h7">
                  Start with red down: <span style={styles}>{game.settings.redDown ? "Yes" : "No"}</span>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="h7">
                  Hitler knows Fascists in 7+: <span style={styles}>{game.settings.hitlerKnowsFasc ? "Yes" : "No"}</span>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="h7">
                  Simple blind: <span style={styles}>{game.settings.simpleBlind ? "Yes" : "No"}</span>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="h7">
                  Cooperative blind: <span style={styles}>{game.settings.cooperativeBlind ? "Yes" : "No"}</span>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="h7">
                  Complete blind: <span style={styles}>{game.settings.completeBlind ? "Yes" : "No"}</span>
                </Typography>
              </ListItem>
            </List>
          </Card>
        )}
      </>
    );
  } else {
    return <Loading />;
  }
}
