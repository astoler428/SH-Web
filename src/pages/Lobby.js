import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { UPDATE, Status, GameSettings, GameType } from "../consts";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import client, { post } from "../api/api";
import { Typography, Box, Toolbar, Button, AppBar } from "@mui/material";
import GameSettingsComponent from "../components/GameSettingsComponent";
import HostGameSettings from "../components/HostGameSettings";
import NonHostGameSettings from "../components/NonHostGameSettings";
import Loading from "../components/Loading";

export default function Lobby({ name, game, setGame, isConnected, setError }) {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const enteringGameRef = useRef(false);
  const initialSettings = game?.settings || { type: GameType.BLIND, redDown: false, hitlerKnowsFasc: false, simpleBlind: false };
  const [currentSettings, setCurrentSettings] = useState(initialSettings);
  //join game (redundant but just in case someone navigates directly to the url)
  useEffect(() => {
    joinGame();
    async function joinGame() {
      try {
        await client.post(`/game/join/${id}`, { name, socketId: socket.id });
      } catch (err) {
        console.error(err);
        console.error(err?.response?.data?.message);
        setError(err?.response?.data?.message || `Cannot join a game ${!isConnected ? `while offline.` : `at this time.`}`);
        navigate("/");
      }
    }
  }, [id, name, navigate, setGame, isConnected]);

  //click listener to start the game - a socket message update comes in causing navigation
  async function startGame() {
    if (game.host === name) {
      await post(`/game/start/${id}`);
    }
  }

  //listening for updates - in lobby the only updates are the players gotten from the updated game obj
  // and whether or not to join the game
  useEffect(() => {
    socket.on(UPDATE, handleUpdate);

    function handleUpdate(game) {
      setGame(game);
      if (game && game.status !== Status.CREATED) {
        // enteringGameRef.current = true
        // navigate(`/game/${id}`)
        goToGame();
      }
    }

    //called on cleanup - if leaving the lobby (takes into account may be leaving lobby to enter game)
    async function leaveGame() {
      await post(`/game/leave/${id}`, {
        socketId: socket.id,
        enteringGame: enteringGameRef.current,
      });
    }

    return () => {
      socket.off(UPDATE, handleUpdate);
      leaveGame();
    };
  }, []); //will these be an issue causing dismout and leave game to be called?

  function goToGame() {
    enteringGameRef.current = true;
    navigate(`/game/${id}`);
  }

  async function handleSettingsChange(propName, propValue) {
    if (game.host === name) {
      propValue = propName === GameSettings.TYPE ? propValue : !game.settings[propName];
      setCurrentSettings(prevSettings => ({ ...prevSettings, [propName]: propValue }));
      await post(`/game/settings/${id}`, {
        gameSettings: { ...game.settings, [propName]: propValue },
      });
    }
  }

  useEffect(() => {
    if (game?.settings) {
      setCurrentSettings(game?.settings);
    }
  }, [game?.settings]);

  const players = game?.players?.map((player, idx) => (
    <Typography
      key={player.name}
      variant="h6"
      sx={{
        fontSize: "20px",
        marginBottom: "-3px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        fontWeight: player.name === name ? "bold" : "normal",
        color: player.name === name ? "#7e22ce" : "black",
      }}
    >
      {idx + 1}. {player.name}
    </Typography>
  ));

  const startGameButtonText =
    game?.players?.length < 5 ? `Waiting for more players` : game?.host === name ? `Start Game` : `WAITING for ${game?.host} to start game`;

  const disabled = !game || game?.players?.length < 5 || game?.host !== name;

  console.log(game?.settings);
  return game ? (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game ID: {id}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            marginTop: { xs: "30px", sm: "10vh" },
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "320px",
            gap: { xs: 1.5, sm: 4 },
          }}
        >
          {game?.host === name ? (
            <HostGameSettings game={game} handleSettingsChange={handleSettingsChange} currentSettings={currentSettings} />
          ) : (
            <NonHostGameSettings game={game} />
          )}
          {/* <GameSettingsComponent game={game} name={name} handleSettingsChange={handleSettingsChange} /> */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: "27px",
                marginBottom: "5px",
                display: "block",
                fontWeight: 500,
                fontFamily: "inter",
                letterSpacing: "-.5px",
              }}
            >
              Players
            </Typography>
            {players}
          </Box>
          <Button variant="contained" disabled={disabled} onClick={startGame}>
            {startGameButtonText}
          </Button>
        </Box>
      </Box>
    </>
  ) : (
    <Loading />
  );
}
