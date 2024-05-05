import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { ENACT_POLICY_DURATION, GAMEOVER_NOT_FROM_POLICY_DELAY, GameType, Role, Status, TOP_DECK_DELAY, colors } from "../consts";
import { gameEndedWithPolicyEnactment, gameOver, isBlindSetting } from "../helperFunctions";
import Game from "../pages/Game";

export default function StatusMessage({ game, hitlerFlippedForLibSpyGuess }) {
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [policyState, setPolicyState] = useState({ lib: game.LibPoliciesEnacted, fasc: game.FascPoliciesEnacted });
  const message = getStatusMessage(game.status);

  function getStatusMessage(status) {
    if (game.LibPoliciesEnacted !== policyState.lib || game.FascPoliciesEnacted !== policyState.fasc) {
      return "Enacting a policy";
    }
    let message;
    switch (status) {
      case Status.STARTED:
        message = isBlindSetting(game.settings.type) ? "Roles are hidden" : "Showing roles";
        break;
      case Status.CHOOSE_CHAN:
        message = "President to select chancellor";
        break;
      case Status.VOTE:
        message = "Players to vote";
        break;
      case Status.SHOW_VOTE_RESULT:
        message = "Tallying vote results";
        break;
      case Status.PRES_DISCARD:
        message = "Waiting on president to discard a policy";
        break;
      case Status.CHAN_PLAY:
      case Status.VETO_DECLINED:
        message = "Waiting on chancellor to enact";
        break;
      case Status.CHAN_CLAIM:
        message = "Waiting on chancellor claim";
        break;
      case Status.PRES_CLAIM:
        message = "Waiting on president claim";
        break;
      case Status.INV:
        message = "Waiting on president to investigate";
        break;
      case Status.INV_CLAIM:
        message = "Waiting on president to claim investigation";
        break;
      case Status.SE:
        message = "Waiting on president to special elect";
        break;
      case Status.GUN:
        message = "Waiting on president to shoot";
        break;
      case Status.INSPECT_TOP3:
        message = "Waiting on president to claim top 3 policies";
        break;
      case Status.VETO_REPLY:
        message = "Waiting on president to decide on veto";
        break;
      case Status.LIB_SPY_GUESS:
        message = "Waiting on Hitler to guess the liberal spy";
        break;
      case Status.SHOW_LIB_SPY_GUESS:
        message = "Showing liberal spy guess";
        break;
      case Status.END_FASC:
      case Status.END_LIB:
        const winners = game.status === Status.END_FASC ? "Fascists" : "Liberals";
        //two conditions where instantly reveal result
        if (
          (game.settings.type === GameType.LIB_SPY && hitlerFlippedForLibSpyGuess) ||
          (game.settings.type === GameType.BLIND && game.players.some(player => player.libWhoTriedToConfirmFasc))
        ) {
          message = `Game over. ${winners} win!`;
        } else if (showGameOverMessage) {
          message = `Game over. ${winners} win!`;
        } else {
          message = getIfGameContinuedMessage();
        }
        // message = showGameOverMessage ? `Game over. ${winners} win!` : `Game over`;
        break;
    }
    return message;
  }

  function getIfGameContinuedMessage() {
    let message;

    if (game.players.find(player => player.role === Role.HITLER).alive === false) {
      message = "Hitler is shot";
    } else if (game.FascPoliciesEnacted >= 3 && game.players.find(player => player.role === Role.HITLER).name === game.currentChan) {
      message = "Hitler elected chancellor";
    } else {
      message = `Game over`;
    }
    return message;
  }

  useEffect(() => {
    if (gameOver(game.status)) {
      const gameOverDelay = gameEndedWithPolicyEnactment(game, hitlerFlippedForLibSpyGuess)
        ? game.topDecked
          ? ENACT_POLICY_DURATION + TOP_DECK_DELAY
          : ENACT_POLICY_DURATION
        : GAMEOVER_NOT_FROM_POLICY_DELAY;
      setTimeout(() => setShowGameOverMessage(true), gameOverDelay * 1000);
    }
  }, [game.status]);

  useEffect(() => {
    if (game.LibPoliciesEnacted !== policyState.lib || game.FascPoliciesEnacted !== policyState.fasc) {
      //delay matches pauseActions
      const delay = game.topDecked ? (1000 * (ENACT_POLICY_DURATION + TOP_DECK_DELAY) * 2) / 3 : (1000 * ENACT_POLICY_DURATION * 2) / 3;
      setTimeout(() => {
        setPolicyState({ lib: game.LibPoliciesEnacted, fasc: game.FascPoliciesEnacted });
      }, delay);
    }
  }, [game.status]);

  return (
    <Box
      sx={{
        height: { xs: 30, sm: 30, md: 40 },
        width: "100%",
        backgroundColor: "#171717",
        // borderBottom: "2px outset gray",
        // paddingTop: "1px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          color: colors.hidden,
          marginLeft: "5px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: { xs: "18px", sm: "18px", md: "20px" },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
