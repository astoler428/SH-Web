import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import client, { post } from "../api/api";
import { socket } from "../socket";
import {
  Status,
  UPDATE,
  colors,
  TOP_DECK_DELAY,
  GAMEOVER_NOT_FROM_POLICY_DELAY,
  ENACT_POLICY_DURATION,
  INV_DURATION,
  VOTE_DELAY,
  VOTE_DURATION,
  HITLER_FLIP_FOR_LIB_SPY_GUESS_DURATION,
} from "../consts";
import { gameOver, gameEndedWithPolicyEnactment } from "../helperFunctions";
import Players from "../components/Players";
import Board from "../components/Board";
import Loading from "../components/Loading";
import { Typography, IconButton, Snackbar, AppBar, Toolbar, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RoleDialog from "../components/RoleDialog";
import ConfirmFascDialog from "../components/ConfirmFascDialog";
import GameSettingsDialog from "../components/GameSettingsDialog";
import LogChat from "../components/LogChat";
import Confetti from "react-confetti";

export default function Game({ name, game, setGame, isConnected }) {
  // game.status = Status.CHOOSE_CHAN
  // game.status = Status.STARTED
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const thisPlayer = game?.players.find(player => player.name === name);
  const [roleOpen, setRoleOpen] = useState(false);
  const [gameSettingsOpen, setGameSettingsOpen] = useState(false);
  const [confirmFascOpen, setConfirmFascOpen] = useState(false);
  const [error, setError] = useState(null);
  const [boardDimensions, setBoardDimensions] = useState({ x: 0, y: 0 });
  const [playersDimensions, setPlayersDimensions] = useState({ x: 0, y: 0 });
  const [hitlerFlippedForLibSpyGuess, setHitlerFlippedForLibSpyGuess] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const boardRef = useRef(null);
  const playersRef = useRef(null);
  const boardImageRefs = useRef([]);
  const playerImageRefs = useRef([]);
  const [recycleConfetti, setRecycleConfetti] = useState(true);
  const [runConfetti, setRunConfetti] = useState(false);
  const [pauseActions, setPauseActions] = useState(false);
  //redundant join by just in case someone navigates directly or refreshes page
  useEffect(() => {
    if (isConnected) {
      joinGame();
    }
    async function joinGame() {
      try {
        await client.post(`/game/join/${id}`, { name, socketId: socket.id });
      } catch (err) {
        console.log(err?.response?.data?.message);
        navigate("/");
      }
    }
  }, [id, name, navigate, setGame, isConnected]);

  //listen for updates - this is what will cause component to rerender and display everything appropriately
  useEffect(() => {
    socket.on(UPDATE, game => setGame(game));

    async function leaveGame() {
      await post(`/game/leave/${id}`, {
        socketId: socket.id,
        enteringGame: false,
      });
    }
    return () => {
      socket.off(UPDATE, game => setGame(game));
      leaveGame();
    };
  }, []);

  //'rgb(46, 109, 28)'
  useEffect(() => {
    document.body.style.backgroundColor = "#404040";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  function handleChoosePlayer(e) {
    const card = e.target.closest(".MuiCard-root");
    let chosenName = card.getAttribute("data-key");
    let chosenPlayer = game.players.find(player => player.name === chosenName);
    //perhaps in blind version you can choose yourself to inv

    if (game.status === Status.CHOOSE_CHAN) {
      handleChooseChan(chosenPlayer);
    } else if (game.status === Status.INV) {
      handleChooseInv(chosenPlayer);
    } else if (game.status === Status.SE) {
      handleChooseSE(chosenPlayer);
    } else if (game.status === Status.GUN) {
      handleChooseGun(chosenPlayer);
    } else if (game.status === Status.LIB_SPY_GUESS) {
      handleChooseLibSpy(chosenPlayer);
    }
  }

  //These setErrors no longer happen since caught in players who is choosable and who is not
  async function handleChooseChan(chosenPlayer) {
    // if(chosenPlayer.name === game.prevPres || chosenPlayer.name === game.prevChan){
    //   setError('You must choose an eligible chancellor.')
    //   return
    // }
    await post(`/game/chooseChan/${id}`, { chanName: chosenPlayer.name });
  }

  async function handleChooseInv(chosenPlayer) {
    // if(chosenPlayer.investigated){
    //   setError("This player has already been investigated.")
    //   return
    // }
    await post(`/game/chooseInv/${id}`, { invName: chosenPlayer.name });
  }

  async function handleChooseSE(chosenPlayer) {
    await post(`/game/chooseSE/${id}`, { seName: chosenPlayer.name });
  }

  async function handleChooseGun(chosenPlayer) {
    await post(`/game/chooseGun/${id}`, { shotName: chosenPlayer.name });
  }

  async function handleChooseLibSpy(chosenPlayer) {
    await post(`/game/chooseLibSpy/${id}`, { spyName: chosenPlayer.name });
  }

  async function handleConfirmFasc() {
    setConfirmFascOpen(false);
    await post(`/game/confirmFasc/${id}`, { name: thisPlayer.name });
  }

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setError(null)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  //used to get the height of the board so the logChat can match it, also the playes area depends on it
  //need to check that all images are done loading first
  useEffect(() => {
    function handleBoardResize() {
      if (boardRef.current && boardImageRefs.current.every(img => img.complete)) {
        setBoardDimensions({
          x: boardRef.current.offsetWidth,
          y: boardRef.current.offsetHeight,
        });
      } else {
        setTimeout(handleBoardResize, 100);
      }
    }
    handleBoardResize();

    window.addEventListener("resize", handleBoardResize);
    return () => {
      window.removeEventListener("resize", handleBoardResize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setOpacity(1), 300);
  }, []);

  useEffect(() => {
    if (game?.status === Status.LIB_SPY_GUESS) {
      const delay = game.topDecked ? TOP_DECK_DELAY + ENACT_POLICY_DURATION : ENACT_POLICY_DURATION;
      pauseActions(1000 * (delay + HITLER_FLIP_FOR_LIB_SPY_GUESS_DURATION)); //7500
    } else if (game?.status === Status.PRES_DISCARD) {
      pauseActions(1700); //.3 is initial delay before policy pile animation, .4 is when 3rd policy is drawn, 1s animation gives 1700
    } else if (game?.status === Status.VOTE) {
      pauseActions(1000 * (VOTE_DELAY + VOTE_DURATION - 0.4)); //the .4 seconds is because the animation starts off screen so it can begin before the vote cards have finished animating up
    } else if (game?.status === Status.CHAN_CLAIM) {
      pauseActions((1000 * ENACT_POLICY_DURATION * 2) / 3); //4000
    } else if (game?.status === Status.INV_CLAIM) {
      pauseActions(1000 * INV_DURATION + 500); //3500
    } else if (game?.status === Status.CHOOSE_CHAN && game.topDecked) {
      pauseActions((1000 * ENACT_POLICY_DURATION * 2) / 3); //4000
    } else {
      pauseActions(700); // time for fade out content and uncenter
    }

    function pauseActions(timeout) {
      setPauseActions(true);
      setTimeout(() => setPauseActions(false), timeout);
    }
  }, [game?.status]);

  useEffect(() => {
    if (game?.remakeId) {
      const timeout = (game.players.findIndex(player => player.name === name) + 1) * 1000; //timeout so all players don't join at once and cause concurrency issue
      setTimeout(() => navigate(`/lobby/${game.remakeId}`), timeout);
    }
  }, [game]);

  // determine dimensions of player area
  useEffect(() => {
    function handlePlayersResize() {
      if (playersRef.current && playerImageRefs.current.every(img => img.complete)) {
        setPlayersDimensions({
          x: playersRef.current.offsetWidth,
          y: playersRef.current.offsetHeight,
        });
      } else {
        setTimeout(handlePlayersResize, 100);
      }
    }
    handlePlayersResize();

    window.addEventListener("resize", handlePlayersResize);
    return () => {
      window.removeEventListener("resize", handlePlayersResize);
    };
  }, [boardDimensions]);

  useEffect(() => {
    if (gameOver(game?.status)) {
      const delay = gameEndedWithPolicyEnactment(game, hitlerFlippedForLibSpyGuess)
        ? game.topDecked
          ? 1000 * ((ENACT_POLICY_DURATION * 2) / 3 + TOP_DECK_DELAY)
          : (1000 * ENACT_POLICY_DURATION * 2) / 3
        : (1000 * GAMEOVER_NOT_FROM_POLICY_DELAY) / 2;
      setTimeout(() => setRunConfetti(true), delay);
      setTimeout(() => setRecycleConfetti(false), delay + 6000);
    }
  }, [game?.status]);

  return (
    <>
      {game && game.status !== Status.CREATED ? (
        <Box
          sx={{
            opacity,
            transition: "opacity 1.5s cubic-bezier(0.16, 0.62, 1, 1)",
          }}
        >
          {game.status === Status.END_LIB && <Confetti colors={[colors.lib, colors.libDark]} run={runConfetti} recycle={recycleConfetti} />}
          {game.status === Status.END_FASC && <Confetti colors={[colors.fasc, colors.hitler]} run={runConfetti} recycle={recycleConfetti} />}
          <AppBar
            sx={{
              display: "flex",
              position: "absolute",
              justifyContent: "center",
              height: { xs: "30px", sm: "56px" },
            }}
          >
            <Toolbar sx={{ maxWidth: "95vw" }}>
              <Typography
                component="div"
                sx={{
                  flexGrow: 1,
                  fontFamily: "inter",
                  fontSize: { xs: "14px", sm: "20px" },
                }}
              >
                Game ID: {id}
              </Typography>
              <Button color="inherit" onClick={() => setGameSettingsOpen(true)} sx={{ fontFamily: "inter", fontSize: { xs: "14px" } }}>
                Game Settings
              </Button>
              <Button color="inherit" onClick={() => setRoleOpen(true)} sx={{ fontFamily: "inter", fontSize: { xs: "14px" } }}>
                Role
              </Button>
              <Button
                color="inherit"
                onClick={async () => await post(`/game/remake/${id}`, { name })}
                sx={{ fontFamily: "inter", fontSize: { xs: "14px" } }}
              >
                Remake
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ marginTop: { xs: "30px", sm: "56px" } }} />
          <RoleDialog thisPlayer={thisPlayer} game={game} roleOpen={roleOpen} setRoleOpen={setRoleOpen} setConfirmFascOpen={setConfirmFascOpen} />
          <GameSettingsDialog game={game} gameSettingsOpen={gameSettingsOpen} setGameSettingsOpen={setGameSettingsOpen} />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              maxHeight: { sm: `${boardDimensions.y}px` },
            }}
          >
            <Board
              boardRef={boardRef}
              boardImageRefs={boardImageRefs}
              game={game}
              name={name}
              id={id}
              setError={setError}
              boardDimensions={boardDimensions}
              playersDimensions={playersDimensions}
              pauseActions={pauseActions}
              setPauseActions={setPauseActions}
            />
            {/* hacky, but logChat gets hidden on xs and rendered a few lines down to be below the players */}
            <Box sx={{ display: { xs: "none", sm: "flex", flex: 1 } }}>
              <LogChat game={game} name={name} boardDimensions={boardDimensions} playersDimensions={playersDimensions} />
            </Box>
          </Box>
          <Players
            name={name}
            game={game}
            handleChoosePlayer={handleChoosePlayer}
            playerImageRefs={playerImageRefs}
            playersRef={playersRef}
            playersDimensions={playersDimensions}
            boardDimensions={boardDimensions}
            pauseActions={pauseActions}
            hitlerFlippedForLibSpyGuess={hitlerFlippedForLibSpyGuess}
            setHitlerFlippedForLibSpyGuess={setHitlerFlippedForLibSpyGuess}
            roleOpen={roleOpen}
          />
          <Box sx={{ display: { xs: "flex", sm: "none" }, marginTop: "15px" }}>
            <LogChat game={game} name={name} boardDimensions={boardDimensions} playersDimensions={playersDimensions} />
          </Box>
          {/* Snackbar is used in mixed role to let know if you can't discard */}
          <Snackbar open={error !== null} onClose={() => setError(null)} message={error} autoHideDuration={5000} action={action} />
          <ConfirmFascDialog confirmFascOpen={confirmFascOpen} setConfirmFascOpen={setConfirmFascOpen} handleConfirmFasc={handleConfirmFasc} />
        </Box>
      ) : (
        <Loading />
      )}
    </>
  );
}
