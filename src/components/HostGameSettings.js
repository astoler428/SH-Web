import React, { useState } from "react";
import { Box, FormGroup, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { GameType, GameSettings } from "../consts";
import { isBlindSetting } from "../helperFunctions";
import Loading from "./Loading";

export default function HostGameSettings({ game, handleSettingsChange, currentSettings }) {
  return game ? (
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
          value={currentSettings.type}
          label="Game type"
          onChange={e => handleSettingsChange(GameSettings.TYPE, e.target.value)}
        >
          <MenuItem value={GameType.BLIND}>{GameType.BLIND}</MenuItem>
          <MenuItem value={GameType.COOPERATIVE_BLIND}>{GameType.COOPERATIVE_BLIND}</MenuItem>
          {/* <MenuItem value={GameType.TOTALLY_BLIND}>{GameType.TOTALLY_BLIND}</MenuItem> */}
          <MenuItem value={GameType.NORMAL}>{GameType.NORMAL}</MenuItem>
          <MenuItem value={GameType.LIB_SPY}>{GameType.LIB_SPY}</MenuItem>
          <MenuItem value={GameType.MIXED_ROLES}>{GameType.MIXED_ROLES}</MenuItem>
        </Select>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={currentSettings.redDown} onChange={() => handleSettingsChange(GameSettings.REDDOWN)} />}
          label="Start with red down"
        />
        <FormControlLabel
          // disabled={isBlindSetting(game.settings.type)}
          control={<Checkbox checked={currentSettings.hitlerKnowsFasc} onChange={() => handleSettingsChange(GameSettings.HITLERKNOWSFASC)} />}
          label="Hitler knows fascists in 7+"
        />
        <FormControlLabel
          disabled={!isBlindSetting(game.settings.type)}
          control={<Checkbox checked={currentSettings.simpleBlind} onChange={() => handleSettingsChange(GameSettings.SIMPLEBLIND)} />}
          label="Simple blind"
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
    <Loading />
  );
}
