import React, { useState, useRef, useEffect } from "react";
import {
  colors,
  Status,
  gameOver,
  gameEndedWithPolicyEnactment,
  Role,
  Team,
  GameType,
  Vote,
  choosableAnimation,
  upAndDownAnimation,
  flipAndDownAnimation,
  upAnimation,
  flipAnimation,
  flipAndUnflipAnimation,
  stillAnimation,
} from "../consts";
import {
  Card,
  CircularProgress,
  Grid,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import hitlerPng from "../img/Hitler.png";
import liberalPng from "../img/Liberal.png";
import liberalSpyPng from "../img/LiberalSpy.png";
import fascistPng from "../img/Fascist.png";
import roleBackPng from "../img/RoleBack.png";
import libPartyPng from "../img/LibParty.png";
import fascPartyPng from "../img/FascParty.png";
import jaPng from "../img/Ja.png";
import neinPng from "../img/Nein.png";
import presPng from "../img/President.png";
import chanPng from "../img/Chancellor.png";
import voteBackPng from "../img/VoteBack.png";
import errorPng from "../img/Error.png";
import partyBack from "../img/PartyBack.png";
//card height to width ratio = 1.36

// const colors.hitler = '#A72323'
// const colors.fasc = 'orangered'
// const colors.lib = 'deepskyblue'
// const colors.hidden = '#f5f5f5'

export default function Players({
  name,
  game,
  handleChoosePlayer,
  playerImageRefs,
  playersRef,
  playersDimensions,
  boardDimensions,
  pauseActions,
  hitlerFlippedForLibSpyGuess,
  setHitlerFlippedForLibSpyGuess,
  roleOpen,
}) {
  const [firstRender, setFirstRender] = useState(true);
  const [showPlayerCardLabels, setShowPlayerCardLabels] = useState(true); //basically just gameover or not but want a delay
  const [openToolTip, setOpenToolTip] = useState(game.players.map(() => false));
  const [forceOpenToolTip, setForceOpenToolTip] = useState(
    game.players.map(() => false)
  );
  const [shownFascState, setShownFascState] = useState(
    game.players.map(() => false)
  );
  const [hitlerConfirmed, setHitlerConfirmed] = useState(false);
  const [timeoutIds, setTimeoutIds] = useState(game.players.map(() => null));
  const thisPlayer = game.players.find(player => player.name === name);
  const n = game.players.length;
  const status = game.status;
  const revealWhenHitlerConfirmed = false; //can turn it on or off

  const choosing =
    !pauseActions &&
    ((game.currentPres === name &&
      (status === Status.CHOOSE_CHAN ||
        status === Status.INV ||
        status === Status.SE ||
        status === Status.GUN)) ||
      (thisPlayer.role === Role.HITLER && status === Status.LIB_SPY_GUESS));

  const currentPres = game.players.find(
    player => player.name === game.currentPres
  );
  const getRoleImg = player =>
    game.settings.type === GameType.MIXED_ROLES && player.role !== Role.HITLER
      ? [
          player.role === Role.FASC ? fascistPng : liberalPng,
          getTeamImg(player)[1],
        ]
      : player.role === Role.HITLER
      ? [hitlerPng, colors.hitler]
      : player.role === Role.FASC
      ? [fascistPng, colors.fasc]
      : player.role === Role.LIB_SPY
      ? [liberalSpyPng, colors.lib]
      : [liberalPng, colors.lib];
  const getTeamImg = player =>
    player.team === Team.FASC
      ? [fascPartyPng, colors.fasc]
      : [libPartyPng, colors.lib];
  const getVote = player =>
    player.vote === Vote.JA
      ? jaPng
      : player.vote === Vote.NEIN
      ? neinPng
      : errorPng;
  const setNewState = (prevState, idx, val) => {
    const newState = [...prevState];
    newState[idx] = val;
    return newState;
  };
  const gameOverDelay = gameEndedWithPolicyEnactment(
    game,
    hitlerFlippedForLibSpyGuess
  )
    ? game.topDecked
      ? 7
      : 6
    : 2;

  const renderPlayers = game?.players?.map((player, idx) => {
    let choosable = false;
    let makingDecision = false;
    let nameColor = colors.hidden;
    let roleContent = roleBackPng;
    let roleContentFlip = roleBackPng;
    let overlayContent = null;
    let overlayContentFlip = null;
    let animation = "";
    let roleAnimation = "";
    let chooseAnimation = "";
    let nameColorTransition = "color 1.5s";
    let flipAndDownDuration = 4; //varies based on vote split

    const thisPlayerInvestigatedPlayer = thisPlayer.investigations.some(
      invName => invName === player.name
    );

    //check if player is choosable
    if (choosing && player.name !== name) {
      //possibly allow a self investigation in blind game
      if (status === Status.LIB_SPY_GUESS) {
        choosable =
          player.team === Team.LIB ||
          (!game.settings.hitlerKnowsFasc && player.role !== Role.HITLER);
      } else if (!player.alive) {
        choosable = false;
      } else if (status === Status.CHOOSE_CHAN) {
        choosable =
          game.prevChan !== player.name && game.prevPres !== player.name;
      } else if (status === Status.INV) {
        choosable = !player.investigated;
      } else {
        choosable = true;
      }
    }

    if (choosable) {
      chooseAnimation = "choosable 1.3s infinite .5s";
    }

    //making decision for circular progress bar

    if (game.currentPres === player.name) {
      if (
        status === Status.CHOOSE_CHAN ||
        status === Status.PRES_DISCARD ||
        status === Status.PRES_CLAIM ||
        status === Status.GUN ||
        status === Status.INSPECT_TOP3 ||
        status === Status.INV ||
        status === Status.INV_CLAIM ||
        status === Status.VETO_REPLY ||
        status === Status.SE
      ) {
        makingDecision = true;
      }
    }
    if (game.currentChan === player.name) {
      if (
        status === Status.CHAN_PLAY ||
        status === Status.CHAN_CLAIM ||
        status === Status.VETO_DECLINED
      ) {
        makingDecision = true;
      }
    }
    if (status === Status.VOTE && !player.vote && player.alive) {
      makingDecision = true;
    }
    if (status === Status.LIB_SPY_GUESS && player.role === Role.HITLER) {
      makingDecision = true;
    }

    if (pauseActions) {
      makingDecision = false;
    }

    //content of role and name color

    //your own role
    if (player.name === name) {
      [roleContent, nameColor] = showOwnRole(player)
        ? getRoleImg(player)
        : [roleBackPng, colors.hidden];
    }
    //fasc see other fasc
    else if (
      player.team === Team.FASC &&
      thisPlayer.team === Team.FASC &&
      showOtherFasc(thisPlayer, player)
    ) {
      [, nameColor] = getRoleImg(player);
    } else if (thisPlayerInvestigatedPlayer) {
      [, nameColor] = getTeamImg(player);
    }

    if (player.role === Role.HITLER && hitlerFlippedForLibSpyGuess) {
      [roleContent, nameColor] = getRoleImg(player);
    }

    //animations

    if (status === Status.STARTED && game.settings.type !== GameType.BLIND) {
      if (player.name === name) {
        roleContent = roleBackPng;
        roleContentFlip = getRoleImg(player)[0];
        roleAnimation = "flip 1s forwards 2s";
        nameColorTransition = "color 1s 2s";
      } else if (
        player.team === Team.FASC &&
        thisPlayer.team === Team.FASC &&
        showOtherFasc(thisPlayer, player)
      ) {
        roleContent = roleBackPng;
        roleContentFlip = getRoleImg(player)[0];
        roleAnimation = "flipAndUnflip 5s forwards 4s";
        nameColorTransition = "color 1s 4s";
      }
    } else if (status === Status.VOTE) {
      if (player.alive) {
        overlayContent = voteBackPng;
        animation = "up .9s forwards .1s";
      }
    } else if (status === Status.SHOW_VOTE_RESULT) {
      if (player.alive) {
        overlayContent = voteBackPng;
        overlayContentFlip = getVote(player);

        const jas = game.players.reduce(
          (acc, player) => (player.vote === Vote.JA ? acc + 1 : acc),
          0
        );
        const numVotes = game.players.reduce(
          (n, player) => (player.alive ? n + 1 : n),
          0
        );
        const voteSplit = Math.min(jas, numVotes - jas);
        flipAndDownDuration = voteSplit <= 1 ? 4 : voteSplit <= 3 ? 5 : 6;
        animation = `flipAndDown ${flipAndDownDuration}s forwards`;
      }
    } else if (
      status === Status.INV_CLAIM &&
      player.name === currentPres.investigations.slice(-1)[0]
    ) {
      if (currentPres.name === name) {
        nameColor = getTeamImg(player)[1];
        nameColorTransition = "color 1s 1s";
        overlayContent = getTeamImg(player)[0];
      } else {
        overlayContent = partyBack;
      }
      animation = "upAndDown 3s forwards";
    } else if (
      status === Status.LIB_SPY_GUESS &&
      player.role === Role.HITLER &&
      player.name !== name
    ) {
      roleContent = roleBackPng;
      roleContentFlip = hitlerPng;
      const delay = game.topDecked ? 7 : 6;
      roleAnimation = `flip 1.5s forwards ${delay}s`;
      nameColor = colors.hitler;
      nameColorTransition = `color 1.5s ${delay + 1.5}s`;
    } else if (status === Status.SHOW_LIB_SPY_GUESS) {
      const spyGuessedPlayer = game.players.find(
        player => player.guessedToBeLibSpy
      );
      if (
        spyGuessedPlayer.name === player.name &&
        thisPlayer.name !== spyGuessedPlayer.name
      ) {
        roleContent = roleBackPng;
        roleContentFlip = getRoleImg(player)[0];
        roleAnimation = "flipAndUnflip 3s forwards";
        // nameColorTransition = 'color 1s 1s'
      }
    } else if (gameOver(status)) {
      [, nameColor] = getRoleImg(player);

      //flip over everyone elses role, unless blind in which case your needs flipping too if not confirmed, or libSpy and hitler already flipped
      //maybe set this based on whether the roleContent is already a role
      if (roleContent === roleBackPng) {
        roleContent = roleBackPng;
        roleContentFlip = getRoleImg(player)[0];
        // const delay = gameEndedWithPolicyEnactment(game, hitlerFlippedForLibSpyGuess) ? (game.topDecked ? 7 : 6) : 2
        roleAnimation = `flip 3s forwards ${gameOverDelay}s`; //'flip 3s forwards 2.5s'
        nameColorTransition = `color 1.5s ${gameOverDelay + 1.5}s`;
      }
    }

    if (firstRender) {
      nameColor = colors.hidden;
      nameColorTransition = "color .1s";
    }

    const showToolTip =
      player.name === name ||
      (thisPlayer.confirmedFasc &&
        (player.confirmedFasc || player.role === Role.HITLER));
    let tooltipTitle = ``;
    if (player.name === name) {
      tooltipTitle = "You";
    } else if (player.role === Role.HITLER) {
      tooltipTitle = !revealWhenHitlerConfirmed
        ? `Hitler`
        : player.confirmedFasc
        ? "Confirmed Hitler"
        : "Blind Hitler";
    } else if (player.team === Team.FASC && player.confirmedFasc) {
      tooltipTitle = "Confirmed Fascist";
    }

    const flipAndDownkeyFrameStyles = flipAndDownAnimation(
      playersDimensions.y,
      (1 / flipAndDownDuration) * 100
    );
    const upKeyFrameStyles = upAnimation(playersDimensions.y);
    const flipKeyFrameStyles = flipAnimation();
    const upAndDownKeyFrameStyles = upAndDownAnimation(playersDimensions.y);
    const flipAndUnflipKeyFrameStyles = flipAndUnflipAnimation(
      status === Status.SHOW_LIB_SPY_GUESS ? 33 : 20
    );
    const stillKeyFrameStyles = stillAnimation();
    const choosableKeyFrameStyles = choosableAnimation(
      playersDimensions.y < 110 ? 1.5 : 3.5
    );

    function handleOpenToolTipChange(idx, val) {
      if (val === false && forceOpenToolTip[idx]) {
        return;
      }
      setOpenToolTip(prevState => setNewState(prevState, idx, val));
    }
    return (
      <Grid key={idx} item xs={12 / n} sx={{}}>
        <Box
          sx={{
            opacity: player.socketId ? 1 : 0.3,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {showToolTip ? (
            <Tooltip
              open={openToolTip[idx]}
              onOpen={() => handleOpenToolTipChange(idx, true)}
              onClose={() => handleOpenToolTipChange(idx, false)}
              title={tooltipTitle}
              placement="top"
            >
              <Typography
                maxWidth="80%"
                sx={{
                  fontSize: { xs: `calc(${playersDimensions.x}px / ${7 * n})` },
                  margin: `1px 0`,
                  color: nameColor,
                  whiteSpace: "nowrap",
                  fontFamily: "inter",
                  fontWeight: 500,
                  overflow: "hidden",
                  cursor: "default",
                  transition: nameColorTransition,
                }}
              >
                {idx + 1}. {player.name}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              maxWidth="80%"
              sx={{
                fontSize: { xs: `calc(${playersDimensions.x}px / ${7 * n})` },
                margin: `1px 0`,
                color: nameColor,
                whiteSpace: "nowrap",
                fontFamily: "inter",
                fontWeight: 500,
                overflow: "hidden",
                transition: nameColorTransition,
              }}
            >
              {idx + 1}. {player.name}
            </Typography>
          )}
          <Card
            data-key={player.name}
            onClick={choosing && choosable ? handleChoosePlayer : () => {}}
            sx={{
              cursor: choosable ? "pointer" : "auto",
              animation: chooseAnimation,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              backgroundColor: "#404040",
            }}
          >
            <style>{flipAndDownkeyFrameStyles}</style>
            <style>{upKeyFrameStyles}</style>
            <style>{flipKeyFrameStyles}</style>
            <style>{upAndDownKeyFrameStyles}</style>
            <style>{flipAndUnflipKeyFrameStyles}</style>
            <style>{stillKeyFrameStyles}</style>
            <style>{choosableKeyFrameStyles}</style>
            {/* first rolebackimg is just a place holder */}
            <img
              src={roleBackPng}
              style={{ width: "100%", visibility: "hidden" }}
            />
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                width: "99.6%",
                height: "99.6%",
                transform: "translate(.2%, -.2%)",
                backgroundColor: "transparent",
                perspective: 1000,
                left: 0,
                bottom: 0,
                transformStyle: "preserve-3d",
                animation: roleAnimation,
              }}
            >
              <img
                ref={el => (playerImageRefs.current[idx] = el)}
                src={roleContent}
                draggable="false"
                style={{
                  width: "100%",
                  position: "absolute",
                  backfaceVisibility: "hidden",
                }}
              />
              <img
                src={roleContentFlip}
                draggable="false"
                style={{
                  width: "100%",
                  position: "absolute",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                zIndex: 50,
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                perspective: 1000,
                left: 0,
                bottom: -playersDimensions.y,
                transformStyle: "preserve-3d",
                animation,
              }}
            >
              <img
                src={overlayContent}
                draggable="false"
                style={{
                  width: "100%",
                  position: "absolute",
                  backfaceVisibility: "hidden",
                }}
              />
              <img
                src={overlayContentFlip}
                draggable="false"
                style={{
                  width: "100%",
                  position: "absolute",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>
            {showPlayerCardLabels && ( //used to be !(gameOver(status))
              <>
                <img
                  src={presPng}
                  draggable="false"
                  style={{
                    opacity: game.currentPres === player.name ? 1 : 0,
                    transition: "opacity 1s",
                    width: "100%",
                    position: "absolute",
                    zIndex: 75,
                    bottom: 0,
                  }}
                />
                <img
                  src={chanPng}
                  draggable="false"
                  style={{
                    opacity: game.currentChan === player.name ? 1 : 0,
                    transition: "opacity 1s",
                    width: "100%",
                    position: "absolute",
                    zIndex: 75,
                    bottom: 0,
                  }}
                />
                <img
                  src={presPng}
                  draggable="false"
                  style={{
                    opacity: game.prevPres === player.name ? 0.3 : 0,
                    transition: "opacity 1s",
                    width: "100%",
                    position: "absolute",
                    zIndex: 75,
                    top: 0,
                  }}
                />
                <img
                  src={chanPng}
                  draggable="false"
                  style={{
                    opacity: game.prevChan === player.name ? 0.3 : 0,
                    transition: "opacity 1s",
                    width: "100%",
                    position: "absolute",
                    zIndex: 75,
                    top: 0,
                  }}
                />
                {makingDecision && (
                  <Box
                    sx={{
                      position: "absolute",
                      zIndex: 100,
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <CircularProgress
                      thickness={2.5}
                      style={{
                        color: colors.hidden,
                        width: `calc(${playersDimensions.x}px / ${2.5 * n} )`,
                        height: `calc(${playersDimensions.x}px / ${2.5 * n} )`,
                      }}
                    />
                  </Box>
                )}
                <CloseIcon
                  sx={{
                    opacity: player.alive ? 0 : 1,
                    transition: "opacity 1.5s ease-in-out",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: 150,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "red",
                  }}
                />
                {player.name === name && !showOwnRole(player) && (
                  <QuestionMarkIcon
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      zIndex: 25,
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "black",
                    }}
                  />
                )}
              </>
            )}
          </Card>
        </Box>
      </Grid>
    );
  });

  /**
   * zIndex order:
   * roleContent: 10
   * blind ? role: 25
   * overlayContent: 50
   * prev and current pres and chan: 75
   * CircularProgress: 100
   * Dead: 150
   */

  useEffect(() => {
    setFirstRender(false);
    game.players.forEach(player =>
      player.team === Team.FASC ? console.log(player.name + player.role) : ""
    );
  }, []);

  useEffect(() => {
    //if you are not confirmed fasc yet, don't update anything
    //if the roleDialog is open, likely means you just confirmed fasc, don't show yet because it's blocking
    if (!thisPlayer.confirmedFasc || roleOpen) {
      return;
    }
    game.players.forEach((player, idx) => {
      //never do this for yourself
      if (
        player.name !== name &&
        ((player.confirmedFasc && !shownFascState[idx]) ||
          (player.role === Role.HITLER && !hitlerConfirmed))
      ) {
        //timeout because showing right after roleDialog has a chance to fully close causes a glitch in tooltip position
        if (player.role === Role.HITLER && player.confirmedFasc) {
          setHitlerConfirmed(true);
        }
        if (shownFascState[idx] && !revealWhenHitlerConfirmed) {
          //if already shown, then here because hitler just confirmed
          return;
        }
        let timeoutId;
        clearTimeout(timeoutIds[idx]);
        setTimeout(() => {
          setOpenToolTip(prevState => setNewState(prevState, idx, true));
          setShownFascState(prevState => setNewState(prevState, idx, true));
          setForceOpenToolTip(prevState => setNewState(prevState, idx, true));
          timeoutId = setTimeout(() => {
            setForceOpenToolTip(prevState =>
              setNewState(prevState, idx, false)
            );
            setOpenToolTip(prevState => setNewState(prevState, idx, false));
          }, 5000);
          setTimeoutIds(prevState => setNewState(prevState, idx, timeoutId));
        }, 500);
      }
    });
  }, [game, roleOpen]);

  useEffect(() => {
    if (status === Status.LIB_SPY_GUESS) {
      setHitlerFlippedForLibSpyGuess(true);
    } else if (gameOver(status)) {
      setTimeout(() => setShowPlayerCardLabels(false), gameOverDelay * 1000);
    }
  }, [status]);

  function showOwnRole(player) {
    return game.settings.type !== GameType.BLIND || player.confirmedFasc;
  }

  function showOtherFasc(fascPlayer, otherFasc) {
    //in lib spy game, hitler doesnt know fasc
    if (game.settings.type !== GameType.BLIND) {
      return fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc;
    }
    if (!fascPlayer.confirmedFasc) {
      return false;
    }
    // if(fascPlayer.omniFasc){
    //   return true
    // }
    if (fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc) {
      //just return true if fasc see all other fasc
      return otherFasc.confirmedFasc || otherFasc.role === Role.HITLER;
    }
    return false;
  }

  //xs: `min(100vw, calc(70px * ${n}))`,

  return (
    <Box
      ref={playersRef}
      sx={{
        width: {
          xs: "calc(100vw-10px)",
          sm: `calc((100vh - (56px + ${boardDimensions.y}px)) / 1.8 * ${n} )`,
        },
        minWidth: { sm: `calc(60px * ${n})`, md: `calc(90px * ${n})` },
        maxWidth: { sm: `min(calc(100vw - 10px), calc(140px * ${n}))` },
        display: "flex",
        margin: "0 5px",
      }}
    >
      <Grid container spacing={{ xs: 0.5, sm: 1 }}>
        {renderPlayers}
      </Grid>
    </Box>
  );
}
