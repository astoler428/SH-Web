import React, { useState, useRef, useEffect } from "react";
import {
  colors,
  Status,
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
  Identity,
  TOP_DECK_DELAY,
  ENACT_POLICY_DURATION,
  GAMEOVER_NOT_FROM_POLICY_DELAY,
  CONFIRM_FASC_DIALOG_DURATION,
  INV_DURATION,
  VOTE_DELAY,
  VOTE_DURATION,
  HITLER_FLIP_FOR_LIB_SPY_GUESS_DURATION,
} from "../consts";
import { gameOver, gameEndedWithPolicyEnactment, isBlindSetting, policyEnactDelay, showGameOverDelay } from "../helperFunctions";
import { Card, CircularProgress, Grid, Typography, Box, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import hitlerPng from "../img/Hitler.png";
import liberalPng from "../img/Liberal.png";
import liberalSpyPng from "../img/LiberalSpy.png";
import fascistPng from "../img/Fascist.png";
import roleBackPng from "../img/RoleBack.png";
import libPartyPng from "../img/LibParty.png";
import fascPartyPng from "../img/FascParty.png";
import fascistLiberalPng from "../img/FascistLiberal.png";
import liberalFascistPng from "../img/LiberalFascist.png";
import jaPng from "../img/Ja.png";
import neinPng from "../img/Nein.png";
import presPng from "../img/President.png";
import chanPng from "../img/Chancellor.png";
import voteBackPng from "../img/VoteBack.png";
import errorPng from "../img/Error.png";
import partyBackPng from "../img/PartyBack.png";
import hiddenRoleBackPng from "../img/HiddenRoleBack.png";
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
  const [openTooltip, setOpenTooltip] = useState(game.players.map(() => false));
  const [forceOpenTooltip, setForceOpenTooltip] = useState(game.players.map(() => false));
  const [shownFascState, setShownFascState] = useState(game.players.map(() => false));
  const [shownConfirmedFascState, setShownConfirmedFascState] = useState(game.players.map(() => false));
  const [timeoutIds, setTimeoutIds] = useState(game.players.map(() => null));
  const [waitToShowOwnRoleAfterConfirmFasc, setWaitToShowOwnRoleAfterConfirmFasc] = useState(true);
  const thisPlayer = game.players.find(player => player.name === name);
  const n = game.players.length;
  const status = game.status;
  //can turn it on or off
  const revealWhenHitlerConfirmedFlag = true;
  const fascSeeAllOtherFascUponConfirmingFlag = false;

  const choosing =
    !pauseActions &&
    ((game.currentPres === name && (status === Status.CHOOSE_CHAN || status === Status.INV || status === Status.SE || status === Status.GUN)) ||
      (thisPlayer.role === Role.HITLER && status === Status.LIB_SPY_GUESS));

  const currentPres = game.players.find(player => player.name === game.currentPres);
  const getRoleImg = player =>
    game.settings.type === GameType.MIXED_ROLES
      ? getMixedImg(player)
      : player.role === Role.HITLER
      ? [hitlerPng, colors.hitler]
      : player.role === Role.FASC
      ? [fascistPng, colors.fasc]
      : player.role === Role.LIB_SPY
      ? [liberalSpyPng, colors.lib]
      : [liberalPng, colors.lib];
  const getTeamImg = player => (player.team === Team.FASC ? [fascPartyPng, colors.fasc] : [libPartyPng, colors.lib]);
  const getMixedImg = player => {
    if (player.role === Role.HITLER) {
      return [hitlerPng, colors.hitler];
    } else if (player.role === Role.LIB && player.team === Team.LIB) {
      return [liberalPng, colors.lib];
    } else if (player.role === Role.LIB && player.team === Team.FASC) {
      return [fascistLiberalPng, colors.fasc];
    } else if (player.role === Role.FASC && player.team === Team.FASC) {
      return [fascistPng, colors.fasc];
    } else {
      return [liberalFascistPng, colors.lib];
    }
  };
  const getVote = player => (player.vote === Vote.JA ? jaPng : player.vote === Vote.NEIN ? neinPng : errorPng);
  const setNewState = (prevState, idx, val) => {
    const newState = [...prevState];
    newState[idx] = val;
    return newState;
  };
  const gameOverDelay = showGameOverDelay(game, hitlerFlippedForLibSpyGuess);
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
    let showTooltip = false;
    let tooltipTitle = ``;

    const thisPlayerInvestigatedPlayer = thisPlayer.investigations.some(invName => invName === player.name);

    //check if player is choosable
    if (choosing && player.name !== name) {
      //possibly allow a self investigation in blind game
      if (status === Status.LIB_SPY_GUESS) {
        choosable = player.team === Team.LIB || (!game.settings.hitlerKnowsFasc && player.role !== Role.HITLER);
      } else if (!player.alive) {
        choosable = false;
      } else if (status === Status.CHOOSE_CHAN) {
        choosable = game.prevChan !== player.name && game.prevPres !== player.name;
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
      if (status === Status.CHAN_PLAY || status === Status.CHAN_CLAIM || status === Status.VETO_DECLINED) {
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

    //your own role
    if (player.name === name) {
      [roleContent, nameColor] = showOwnRole(player) ? getRoleImg(player) : [hiddenRoleBackPng, colors.hidden]; //roleBackPng

      showTooltip = true;
      tooltipTitle = "You";
    }
    //fasc see other fasc
    else if (player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)) {
      [, nameColor] = getRoleImg(player);
      showTooltip = true;

      if (game.settings.type === GameType.BLIND) {
        if (player.role === Role.FASC) {
          tooltipTitle = player.confirmedFasc ? `confirmed fascist` : `fascist`;
        } else if (player.role === Role.HITLER) {
          tooltipTitle = !revealWhenHitlerConfirmedFlag ? `Hitler` : player.confirmedFasc ? `confirmed Hitler` : `blind Hitler`;
        }
      } else if (game.settings.type === GameType.MIXED_ROLES) {
        tooltipTitle = player.role === Role.HITLER ? `Hitler` : `${player.team} ${player.role}`;
      } else {
        tooltipTitle = player.role;
      }
    } else if (thisPlayerInvestigatedPlayer && !(game.settings.type === GameType.COOPERATIVE_BLIND)) {
      [, nameColor] = getTeamImg(player);
      showTooltip = true;
      tooltipTitle = `${player.team}`;
    }

    if (player.role === Role.HITLER && hitlerFlippedForLibSpyGuess) {
      [roleContent, nameColor] = getRoleImg(player);
    }

    //animations

    if (status === Status.STARTED) {
      if (!isBlindSetting(game.settings.type)) {
        if (player.name === name) {
          roleContent = roleBackPng;
          roleContentFlip = getRoleImg(player)[0];
          roleAnimation = "flip 1s forwards 2s";
          nameColorTransition = "color 1s 2s";
        } else if (player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)) {
          roleContent = roleBackPng;
          roleContentFlip = getRoleImg(player)[0];
          roleAnimation = "flipAndUnflip 5s forwards 4s"; //matches backend of 9s
          nameColorTransition = "color 1s 4s";
        }
      }
    } else if (status === Status.VOTE) {
      if (player.alive) {
        overlayContent = voteBackPng;
        animation = `up ${VOTE_DURATION}s forwards ${VOTE_DELAY}s`;
      }
    } else if (status === Status.SHOW_VOTE_RESULT) {
      if (player.alive) {
        overlayContent = voteBackPng;
        overlayContentFlip = getVote(player);

        const jas = game.players.reduce((acc, player) => (player.vote === Vote.JA ? acc + 1 : acc), 0);
        const numVotes = game.players.reduce((n, player) => (player.alive ? n + 1 : n), 0);
        const voteSplit = Math.min(jas, numVotes - jas);
        flipAndDownDuration = voteSplit <= 1 ? 4 : voteSplit <= 3 ? 5 : 6; //matches backend
        animation = `flipAndDown ${flipAndDownDuration}s forwards`;
      }
    } else if (status === Status.INV_CLAIM && player.name === currentPres.investigations.slice(-1)[0]) {
      if (currentPres.name === name && !(game.settings.type === GameType.COOPERATIVE_BLIND)) {
        nameColor = nameColor === colors.hitler ? nameColor : getTeamImg(player)[1]; //if you were already seeing them as hitler, don't switch to fasc color
        nameColorTransition = "color 1s 1s"; //timed relative to inv_duration and it's animation keyframes
        overlayContent = getTeamImg(player)[0];
      } else {
        overlayContent = partyBackPng;
      }
      animation = `upAndDown ${INV_DURATION}s forwards`;
    } else if (status === Status.LIB_SPY_GUESS && player.role === Role.HITLER && player.name !== name) {
      roleContent = roleBackPng;
      roleContentFlip = hitlerPng;
      const delay = (2 / 3) * ENACT_POLICY_DURATION + policyEnactDelay(game);
      roleAnimation = `flip ${HITLER_FLIP_FOR_LIB_SPY_GUESS_DURATION}s forwards ${delay}s`;
      nameColor = colors.hitler;
      nameColorTransition = `color ${HITLER_FLIP_FOR_LIB_SPY_GUESS_DURATION}s ${delay}s`;
    } else if (status === Status.SHOW_LIB_SPY_GUESS) {
      const spyGuessedPlayer = game.players.find(player => player.guessedToBeLibSpy);
      if (spyGuessedPlayer.name === player.name && thisPlayer.name !== spyGuessedPlayer.name) {
        roleContent = roleBackPng;
        roleContentFlip = getRoleImg(player)[0];
        roleAnimation = "flipAndUnflip 3s forwards"; //3s matches backend length before determines result of libspyguess
        // nameColorTransition = 'color 1s 1s'
      }
    } else if (gameOver(status)) {
      [, nameColor] = getRoleImg(player);

      //flip over everyone elses role, unless blind in which case your needs flipping too if not confirmed, or libSpy and hitler already flipped
      //maybe set this based on whether the roleContent is already a role
      if (roleContent === roleBackPng || roleContent === hiddenRoleBackPng) {
        // roleContent = roleBackPng;
        roleContentFlip = getRoleImg(player)[0];
        // const delay = gameEndedWithPolicyEnactment(game, hitlerFlippedForLibSpyGuess) ? (game.topDecked ? 7 : 6) : 2
        roleAnimation = game.alreadyEnded ? `flip 0s forwards` : `flip 3s forwards ${gameOverDelay}s`; //'flip 3s forwards 2.5s'
        nameColorTransition = game.alreadyEnded ? `` : `color 1.5s ${gameOverDelay + 1.5}s`;
      }
    }

    if (firstRender) {
      nameColor = colors.hidden;
      nameColorTransition = "color .1s";
    }

    const flipAndDownkeyFrameStyles = flipAndDownAnimation(playersDimensions.y, (1 / flipAndDownDuration) * 100);
    const upKeyFrameStyles = upAnimation(playersDimensions.y);
    const flipKeyFrameStyles = flipAnimation();
    const upAndDownKeyFrameStyles = upAndDownAnimation(playersDimensions.y);
    const flipAndUnflipKeyFrameStyles = flipAndUnflipAnimation(status === Status.SHOW_LIB_SPY_GUESS ? 33 : 20);
    const stillKeyFrameStyles = stillAnimation();
    const choosableKeyFrameStyles = choosableAnimation(Math.max(1.75, playersDimensions.y / 60));

    function handleOpenTooltip(idx, val) {
      if (val === false && forceOpenTooltip[idx]) {
        return;
      }
      setOpenTooltip(prevState => setNewState(prevState, idx, val));
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
          {showTooltip ? (
            <Tooltip
              open={openTooltip[idx]}
              onOpen={() => handleOpenTooltip(idx, true)}
              onClose={() => handleOpenTooltip(idx, false)}
              title={tooltipTitle}
              placement="top"
            >
              <Typography
                maxWidth="80%"
                sx={{
                  fontSize: { xs: `calc(${playersDimensions.x}px / ${8 * n})` },
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
                fontSize: { xs: `calc(${playersDimensions.x}px / ${8 * n})` },
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
              boxShadow: "none",
              borderRadius: `${playersDimensions.y / 60}px`,
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
            <img src={roleBackPng} style={{ width: "100%", visibility: "hidden" }} />
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
   * Alliance color opacity: 15
   * blind ? role: 25
   * overlayContent: 50
   * prev and current pres and chan: 75
   * CircularProgress: 100
   * Dead: 150
   */

  useEffect(() => {
    setFirstRender(false);
    game.players.forEach(player => (player.team === Team.FASC ? console.log(player.name + player.role) : ""));
  }, []);

  useEffect(() => {
    if (thisPlayer.confirmedFasc) {
      setTimeout(() => setWaitToShowOwnRoleAfterConfirmFasc(false), CONFIRM_FASC_DIALOG_DURATION * 1000);
    }
  }, [thisPlayer.confirmedFasc]);

  useEffect(() => {
    //if you are not confirmed fasc yet, don't update anything
    //if the roleDialog is open, likely means you just confirmed fasc, don't show yet because it's blocking
    if (!thisPlayer.confirmedFasc || roleOpen) {
      return;
    }
    if (game.alreadyEnded) {
      //avoids the animations on refresh
      return;
    }
    game.players.forEach((player, idx) => {
      //never do this for yourself
      if (
        player.name !== name &&
        ((fascSeeAllOtherFascUponConfirmingFlag && !shownFascState[idx]) ||
          (player.confirmedFasc && !shownConfirmedFascState[idx]) ||
          (player.role === Role.HITLER && !shownConfirmedFascState[idx]))
      ) {
        //timeout because showing right after roleDialog has a chance to fully close causes a glitch in tooltip position
        if (player.confirmedFasc) {
          setShownConfirmedFascState(prevState => setNewState(prevState, idx, true));
        }

        if (shownFascState[idx] && player.role === Role.HITLER && !revealWhenHitlerConfirmedFlag) {
          //if already shown, then here because hitler just confirmed
          return;
        }

        if (shownFascState[idx] && player.role === Role.HITLER && !player.confirmedFasc) {
          return;
        }
        let timeoutId;
        clearTimeout(timeoutIds[idx]);
        setTimeout(() => {
          setOpenTooltip(prevState => setNewState(prevState, idx, true));
          setShownFascState(prevState => setNewState(prevState, idx, true));
          setForceOpenTooltip(prevState => setNewState(prevState, idx, true));
          timeoutId = setTimeout(() => {
            setForceOpenTooltip(prevState => setNewState(prevState, idx, false));
            setOpenTooltip(prevState => setNewState(prevState, idx, false));
          }, 5000);
          setTimeoutIds(prevState => setNewState(prevState, idx, timeoutId));
        }, 500);
      }
    });
  }, [game, roleOpen]);

  useEffect(() => {
    if (status === Status.LIB_SPY_GUESS || status === Status.SHOW_LIB_SPY_GUESS) {
      //show_lib_spy_guess is redundant but in case of a refresh, need to set the state again
      setHitlerFlippedForLibSpyGuess(true);
    } else if (gameOver(status)) {
      setTimeout(() => setShowPlayerCardLabels(false), gameOverDelay * 1000);
    }
  }, [status]);

  function showOwnRole(player) {
    return !isBlindSetting(game.settings.type) || (player.confirmedFasc && !waitToShowOwnRoleAfterConfirmFasc);
  }

  function showOtherFasc(fascPlayer, otherFasc) {
    //FYI on backend, I set hitlerknowsFasc false for a lib spy game
    if (!isBlindSetting(game.settings.type)) {
      return fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc;
    }
    if (!fascPlayer.confirmedFasc) {
      return false;
    }
    // if(fascPlayer.omniFasc){
    //   return true
    // }
    if (!waitToShowOwnRoleAfterConfirmFasc && (fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc)) {
      //just return true if fasc see all other fasc
      return fascSeeAllOtherFascUponConfirmingFlag ? true : otherFasc.confirmedFasc || otherFasc.role === Role.HITLER;
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
          sm: `calc((100vh - (30px + ${boardDimensions.y}px)) / 1.8 * ${n} )`,
          md: `calc((100vh - (56px + ${boardDimensions.y}px)) / 1.8 * ${n} )`,
        },
        minWidth: { sm: `calc(50px * ${n})`, md: `calc(90px * ${n})` },
        maxWidth: { sm: `min(calc(100vw - 10px), calc(140px * ${n}))` },
        display: "flex",
        padding: { xs: "1px 5px 7px 5px", sm: "5px 5px 0 5px" },
        // border: "2px solid red",
      }}
    >
      <Grid container spacing={{ xs: 0.55, sm: 1 }}>
        {" "}
        {/**used to be xs: .5 */}
        {renderPlayers}
      </Grid>
      {/* preloading images */}
      <img src={hitlerPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={liberalSpyPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={liberalPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={fascistPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={roleBackPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={libPartyPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={fascPartyPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={fascistLiberalPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={liberalFascistPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={neinPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={jaPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={voteBackPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={partyBackPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
      <img src={hiddenRoleBackPng} draggable="false" style={{ visibility: "hidden", width: 0, height: 0 }} />
    </Box>
  );
}
