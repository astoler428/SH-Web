import React from "react";
import { Typography, Card, List, ListItem } from "@mui/material";
import { GameSettings } from "../consts";
import Loading from "./Loading";

export default function NonHostGameSettings({ game }) {
  const styles = { fontSize: 16, fontWeight: "normal", fontFamily: "inter" };

  return game ? (
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
      </List>
    </Card>
  ) : (
    <Loading />
  );
}
