import React from "react";
import Loading from "./Loading";
import NonHostGameSettings from "./NonHostGameSettings";
import HostGameSettings from "./HostGameSettings";

//NOT USED

export default function GameSettingsComponent({ game, name, handleSettingsChange }) {
  const styles = { fontSize: 16, fontWeight: "normal", fontFamily: "inter" };
  if (game) {
    return (
      <>{game.host === name ? <HostGameSettings game={game} handleSettingsChange={handleSettingsChange} /> : <NonHostGameSettings game={game} />}</>
    );
  } else {
    return <Loading />;
  }
}
