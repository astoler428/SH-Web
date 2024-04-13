import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography, Box } from "@mui/material";
import libPolicyPng from "../img/LibPolicy.png";
import fascPolicyPng from "../img/FascPolicy.png";
import policyBackPng from "../img/PolicyBack.png";
import jaPng from "../img/Ja.png";
import neinPng from "../img/Nein.png";
import { Color, draws3, PRES3, CHAN2, Status, Vote, Team, Role, GameType, RRR, RRB, RBB, BBB, colors } from "../consts";
import { isBlindSetting } from "../helperFunctions";
import { post } from "../api/api";
import DefaulDiscardDialog from "./DefaultDiscardDialog";

export default function Action({ game, name, id, setError, blur, setBlur, boardDimensions, playersDimensions, pauseActions, setPauseActions }) {
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [centerContent, setCenterContent] = useState(false);
  const [actionContent, setActionContent] = useState(null);
  const [actionTitle, setActionTitle] = useState(null);
  const [otherContent, setOtherContent] = useState(null);
  const [showTop3PoliciesNotClaim, setShowTop3PoliciesNotClaim] = useState(true); //first show policies
  const [keepShowingVoteSelection, setKeepShowingVoteSelection] = useState(true); //when show vote starts - keep showing the players selected vote
  const [currentVote, setCurrentVote] = useState(null);
  const isCurrentPres = game.currentPres === name;
  const isCurrentChan = game.currentChan === name;
  const thisPlayer = game.players.find(player => player.name === name);
  const isHitler = thisPlayer.role === Role.HITLER;
  const inVetoZone = game.FascPoliciesEnacted === 5;
  const n = game.players.length;
  const status = game.status;
  let title,
    content,
    _blur = false,
    showDefaultOption = false;

  const disabled = game.settings.type === GameType.COOPERATIVE_BLIND || game.settings.type === GameType.TOTALLY_BLIND;
  const disabledStyles = disabled
    ? {
        userSelect: "none",
        pointerEvents: "none",
        cursor: "default",
        filter: "contrast(35%)",
        // backgroundColor: "rgba(0, 0, 0, 0.12)",
      }
    : {};

  if ((status === Status.VOTE || (status === Status.SHOW_VOTE_RESULT && keepShowingVoteSelection)) && thisPlayer.alive) {
    title = "SELECT A VOTE.";
    content = showVoteCards();
    _blur = true;
  } else if (status === Status.LIB_SPY_GUESS && isHitler) {
    title = "GUESS THE LIBERAL SPY.";
  } else if (isCurrentPres) {
    showDefaultOption = isBlindSetting(game.settings.type) ? true : false;
    switch (status) {
      case Status.PRES_DISCARD:
        title = "CHOOSE A POLICY TO DISCARD. ";
        content = showPresPolicies();
        _blur = true;
        break;
      case Status.PRES_CLAIM:
        title = "AS PRESIDENT, I DREW...";
        content = showPresClaims();
        _blur = true;
        break;
      case Status.INV_CLAIM:
        title = "THIS PLAYER IS ON TEAM...";
        content = showInvClaims();
        _blur = true;
        break;
      case Status.INSPECT_TOP3:
        title = "THE TOP 3 POLICIES ARE...";
        content = showInspect3PoliciesAndClaims();
        _blur = true;
        if (showTop3PoliciesNotClaim) {
          showDefaultOption = false;
        }
        break;
      case Status.VETO_REPLY:
        title = `THE CHANCELLOR REQUESTS A VETO. ACCEPT OR DECLINE.`;
        content = showVetoOptions();
        _blur = true;
        break;
      case Status.CHOOSE_CHAN:
        title = `CHOOSE AN ELIGIBLE CHANCELLOR.`;
        showDefaultOption = false;
        break;
      case Status.INV:
        title = `CHOOSE A PLAYER TO INVESTIGATE.`;
        showDefaultOption = false;
        break;
      case Status.SE:
        title = `CHOOSE A PLAYER TO BECOME THE NEXT PRESIDENT.`;
        showDefaultOption = false;
        break;
      case Status.GUN:
        title = `CHOOSE A PLAYER TO SHOOT.`;
        showDefaultOption = false;
        break;
      default:
        _blur = false;
        showDefaultOption = false;
    }
  } else if (isCurrentChan) {
    showDefaultOption = isBlindSetting(game.settings.type) ? true : false;
    switch (status) {
      case Status.CHAN_PLAY:
        title = `CHOOSE A POLICY TO PLAY${inVetoZone ? ` OR REQUEST A VETO.` : `.`}`;
        content = showChanPolicies();
        _blur = true;
        break;
      case Status.VETO_DECLINED:
        title = `VETO WAS DECLINED. CHOOSE A POLICY TO PLAY.`;
        content = showChanPolicies();
        _blur = true;
        break;
      case Status.CHAN_CLAIM:
        title = "AS CHANCELLOR, I RECEIVED...";
        content = showChanClaims();
        _blur = true;
        break;
      default:
        _blur = false;
        showDefaultOption = false;
    }
  }

  const fixedOtherContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "80%",
        maxWidth: `min(250px, ${boardDimensions.x / 2}px)`,
      }}
    >
      {inVetoZone && isCurrentChan && status === Status.CHAN_PLAY && (
        <Button variant="contained" color="secondary" disabled={disabled} sx={{ fontSize: { xs: "min(1em, 16px)" } }} onClick={handleVetoRequest}>
          Request Veto
        </Button>
      )}
      {showDefaultOption && (
        <Button
          variant="contained"
          style={{ backgroundColor: colors.default }}
          sx={{ fontSize: { xs: "min(1em, 16px)" } }}
          onClick={handleDefaultAction}
        >
          Default to Role
        </Button>
      )}
      {showTop3PoliciesNotClaim && isCurrentPres && status === Status.INSPECT_TOP3 && (
        <Button variant="contained" color="secondary" sx={{ fontSize: { xs: "min(1em, 16px)" } }} onClick={() => setShowTop3PoliciesNotClaim(false)}>
          Make Claim
        </Button>
      )}
    </Box>
  );
  /**
   * order:
   * previousActionContent set and centered
   * new status comes in: new content is determined but old content is set
   * immediately set to uncenter in useEffect, which does the fade
   * at the same time, pause actions is set
   * after pause actions is done - new content is set and centered
   */

  useEffect(() => {
    if (status === Status.SHOW_VOTE_RESULT && keepShowingVoteSelection) {
      setActionContent(content);
      setTimeout(() => setKeepShowingVoteSelection(false), 300);
      return;
    }

    if (centerContent) {
      setCenterContent(false);
    }
    if (blur) {
      setBlur(false);
    }

    if (status !== Status.SHOW_VOTE_RESULT && !keepShowingVoteSelection) {
      setKeepShowingVoteSelection(true);
    }
  }, [status, showTop3PoliciesNotClaim, keepShowingVoteSelection]);

  useEffect(() => {
    if (!centerContent && (content || title) && !pauseActions) {
      //need !centerContent otherwise infinite loop since this depends on centerContent and only set if there is content to set (otherwise flash)

      const setEverything = () => {
        setActionContent(content);
        setActionTitle(title);
        setOtherContent(fixedOtherContent);
        setBlur(_blur);
        setCenterContent(true);
      };

      //alternate cooperative blind interaction player doesn't have to click
      // if (disabled && (showDefaultOption || status === Status.INSPECT_TOP3)) {
      // handleDefaultAction();
      // }

      if (status === Status.INSPECT_TOP3 && !showTop3PoliciesNotClaim) {
        //need this here because there's no status change, so the automatic pause of 700 isn't set in game
        setTimeout(setEverything, 700);
      } else {
        setEverything();
      }
    }
  }, [centerContent, pauseActions]);

  useEffect(() => {
    if (centerContent && !pauseActions) {
      setActionContent(content);
      setActionTitle(title);
      setOtherContent(fixedOtherContent);
    }
  }, [boardDimensions, playersDimensions]);

  useEffect(() => {
    if (game.status === Status.VOTE) {
      setActionContent(content);
      setActionTitle(title);
      setOtherContent(fixedOtherContent);
    }
    setCurrentVote(thisPlayer.vote);
  }, [thisPlayer.vote]); //Otherwise actionContent does not update with the new vote info

  useEffect(() => {
    if (game.status === Status.VOTE) {
      setActionContent(content);
      setActionTitle(title);
      setOtherContent(fixedOtherContent);
    }
  }, [currentVote]);

  function showVoteCards() {
    return (
      <>
        <img
          onClick={() => (status === Status.VOTE ? handleVote(Vote.JA) : {})}
          draggable="false"
          src={jaPng}
          style={{
            width: boardDimensions.x / 4.5,
            boxShadow: currentVote === Vote.JA ? `0 0 6px ${boardDimensions.x / 50}px #79DFA0` : "none",
            cursor: status === Status.SHOW_VOTE_RESULT ? "auto" : "pointer",
            transition: "box-shadow .3s",
          }}
        />
        <img
          onClick={() => (status === Status.VOTE ? handleVote(Vote.NEIN) : {})}
          draggable="false"
          src={neinPng}
          style={{
            width: boardDimensions.x / 4.5,
            boxShadow: currentVote === Vote.NEIN ? `0 0 6px ${boardDimensions.x / 50}px #79DFA0` : "none",
            cursor: status === Status.SHOW_VOTE_RESULT ? "auto" : "pointer",
            transition: "box-shadow .3s",
          }}
        />
      </>
    );
  }

  function showPresPolicies() {
    const presPolicies = game.presCards.map((card, i) => {
      const policyImg = disabled ? policyBackPng : getPolicyImg(card);
      return (
        <img
          key={i}
          className="choosable-policy"
          draggable="false"
          data-key={card.color}
          onClick={handlePresDiscard}
          src={policyImg}
          style={{ width: boardDimensions.x / 6, cursor: "pointer", ...disabledStyles }}
        />
      );
    });
    return presPolicies;
  }

  function showChanPolicies() {
    const chanCards = game.chanCards.map((card, i) => {
      const policyImg = disabled ? policyBackPng : getPolicyImg(card);
      return (
        <img
          key={i}
          className="choosable-policy"
          draggable="false"
          data-key={card.color}
          onClick={handleChanPlay}
          src={policyImg}
          style={{ width: boardDimensions.x / 6, cursor: "pointer", ...disabledStyles }}
        />
      );
    });
    return chanCards;
  }

  function showPresClaims() {
    return (
      <Box
        onClick={handlePresClaim}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: `min(250px, ${boardDimensions.x / 2}px)`,
          gap: { xs: 1, sm: 0.5, md: 1 },
        }}
      >
        <Button
          variant="contained"
          data-key={PRES3.RRR}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.fascBackground },
            backgroundColor: colors.fasc,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          3 Fascist policies
        </Button>
        <Button
          variant="contained"
          data-key={PRES3.RRB}
          disabled={disabled}
          color="inherit"
          sx={{
            lineHeight: { xs: "1.2em" },
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          2 Fascist and a Liberal policy
        </Button>
        <Button
          variant="contained"
          data-key={PRES3.RBB}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.libBackground },
            lineHeight: { xs: "1.2em" },
            backgroundColor: colors.lib,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          2 Liberal and a Fascist policy
        </Button>
        <Button
          variant="contained"
          data-key={PRES3.BBB}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.darkLibBackground },
            backgroundColor: colors.libDark,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          3 Liberal policies
        </Button>
      </Box>
    );
  }

  function showChanClaims() {
    return (
      <Box
        onClick={handleChanClaim}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: `min(250px, ${boardDimensions.x / 2}px)`,
          gap: { xs: 1, md: 1 },
        }}
      >
        <Button
          variant="contained"
          data-key={CHAN2.RR}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.fascBackground },
            backgroundColor: colors.fasc,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          2 Fascist policies
        </Button>
        <Button
          variant="contained"
          data-key={CHAN2.RB}
          disabled={disabled}
          color="inherit"
          sx={{
            lineHeight: { xs: "1.2em" },
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          A Fascist and a Liberal policy
        </Button>
        <Button
          variant="contained"
          data-key={CHAN2.BB}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.libBackground },
            backgroundColor: colors.lib,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          2 Liberal policies
        </Button>
      </Box>
    );
  }

  function showInvClaims() {
    return (
      <Box
        onClick={handleInvClaim}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: `min(250px, ${boardDimensions.x / 2}px)`,
          gap: { xs: 1, md: 1 },
        }}
      >
        <Button
          variant="contained"
          data-key={Team.LIB}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.libBackground },
            backgroundColor: colors.lib,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          Liberal
        </Button>
        <Button
          variant="contained"
          data-key={Team.FASC}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.fascBackground },
            backgroundColor: colors.fasc,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          Fascist
        </Button>
      </Box>
    );
  }

  function showInspect3PoliciesAndClaims() {
    const top3 = game.deck.inspectTop3.map((card, i) => (
      <img key={i} draggable="false" src={disabled ? policyBackPng : getPolicyImg(card)} style={{ width: boardDimensions.x / 6 }} />
    ));
    return showTop3PoliciesNotClaim ? (
      top3
    ) : (
      <>
        <Box
          onClick={handleInspect3Claim}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            maxWidth: `min(250px, ${boardDimensions.x / 2}px)`,
            gap: { xs: 1, sm: 0.5, md: 1 },
          }}
        >
          <Button
            variant="contained"
            data-key={PRES3.RRR}
            disabled={disabled}
            sx={{
              "&:hover": { backgroundColor: colors.fascBackground },
              backgroundColor: colors.fasc,
              fontSize: { xs: "min(1em, 16px)" },
            }}
          >
            3 Fascist policies
          </Button>
          <Button
            variant="contained"
            data-key={PRES3.RRB}
            disabled={disabled}
            color="inherit"
            sx={{
              lineHeight: { sm: "12px", md: "16px" },
              fontSize: { xs: "min(1em, 16px)" },
            }}
          >
            2 Fascist and a Liberal policy
          </Button>
          <Button
            variant="contained"
            data-key={PRES3.RBB}
            disabled={disabled}
            sx={{
              "&:hover": { backgroundColor: colors.libBackground },
              backgroundColor: colors.lib,
              lineHeight: { sm: "12px", md: "16px" },
              fontSize: { xs: "min(1em, 16px)" },
            }}
          >
            2 Liberal and a Fascist policy
          </Button>
          <Button
            variant="contained"
            data-key={PRES3.BBB}
            disabled={disabled}
            sx={{
              "&:hover": { backgroundColor: colors.darkLibBackground },
              backgroundColor: colors.libDark,
              fontSize: { xs: "min(1em, 16px)" },
            }}
          >
            3 Liberal policies
          </Button>
        </Box>
      </>
    );
  }

  function showVetoOptions() {
    return (
      <Box
        onClick={handleVetoReply}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: `min(250px, ${boardDimensions.x / 2}px)`,
          gap: { xs: 1 },
        }}
      >
        <Button
          variant="contained"
          data-key={true}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.libBackground },
            backgroundColor: colors.lib,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          data-key={false}
          disabled={disabled}
          sx={{
            "&:hover": { backgroundColor: colors.fascBackground },
            backgroundColor: colors.fasc,
            fontSize: { xs: "min(1em, 16px)" },
          }}
        >
          Decline
        </Button>
      </Box>
    );
  }

  function getPolicyImg(card) {
    return card.color === Color.RED ? fascPolicyPng : libPolicyPng;
  }

  async function handleVote(vote) {
    if (currentVote === thisPlayer.vote) {
      //I wonder if this situation can occur - click Ja -> currentVote set to Ja -> backend call -> somehow does
      //not get processed (still null), but now vote cannot be switched because currentVote !== thisPlayer.vote
      //need to refresh
      if (vote === currentVote) {
        setCurrentVote(null);
      } else {
        setCurrentVote(vote);
      }
      await post(`/game/vote/${id}`, { name, vote });
    }
  }

  async function handlePresDiscard(e) {
    const cardColor = e.target.getAttribute("data-key");
    if (!cardColor) {
      return;
    }
    if (validDiscardDueToMixedRole(cardColor)) {
      await post(`/game/presDiscard/${id}`, { cardColor });
    } else {
      setError(`You cannot discard a ${cardColor} policy.`);
    }
  }

  async function handleChanPlay(e) {
    const cardColor = e.target.getAttribute("data-key");
    if (!cardColor) {
      //have to click on one of the buttons
      return;
    }
    if (validPlayDueToMixedRole(cardColor)) {
      await post(`/game/chanPlay/${id}`, { cardColor });
    } else {
      setError(`You cannot play a ${cardColor} policy.`);
    }
  }

  async function handlePresClaim(e) {
    const claim = e.target.getAttribute("data-key");
    if (!claim) {
      //have to click on one of the buttons
      return;
    }
    await post(`/game/presClaim/${id}`, { claim });
  }

  async function handleChanClaim(e) {
    const claim = e.target.getAttribute("data-key");
    if (!claim) {
      //have to click on one of the buttons
      return;
    }
    await post(`/game/chanClaim/${id}`, { claim });
  }

  async function handleInvClaim(e) {
    const team = e.target.getAttribute("data-key");
    if (!team) {
      //have to click on one of the buttons
      return;
    }
    await post(`/game/invClaim/${id}`, { claim: team });
  }

  async function handleInspect3Claim(e) {
    //setShowTop3PoliciesNotClaim(true) only one inspect top 3 so don't need to set it back
    const claim = e.target.getAttribute("data-key");
    if (!claim) {
      //have to click on one of the buttons
      return;
    }
    await post(`/game/inspect3Claim/${id}`, { claim });
  }

  async function handleVetoRequest() {
    await post(`/game/vetoRequest/${id}`);
  }

  async function handleVetoReply(e) {
    const decision = e.target.getAttribute("data-key");
    if (!decision) {
      //have to click on one of the buttons
      return;
    }
    const vetoAccepted = decision === "true";
    await post(`/game/vetoReply/${id}`, { vetoAccepted });
  }

  async function handleDefaultAction() {
    //different kinds of blind call handleDefaultAction now
    if (status === Status.PRES_DISCARD && game.settings.type === GameType.BLIND) {
      setShowDiscardDialog(true);
    }
    if (status === Status.VETO_DECLINED) {
      await post(`/game/default/${Status.CHAN_PLAY}/${id}`);
    } else {
      await post(`/game/default/${status}/${id}`);
    }
  }

  //does not show default discard if deducable what was dropped
  useEffect(() => {
    if (status === Status.CHAN_CLAIM) {
      const presDraw = draws3[game.presCards.reduce((acc, policy) => acc + (policy.color === Color.BLUE ? 1 : 0), 0)];
      if (
        presDraw === BBB ||
        presDraw === RRR ||
        (presDraw === RRB && game.chanPlay.color === Color.BLUE) ||
        (presDraw === RBB && game.chanPlay.color === Color.RED)
      ) {
        setShowDiscardDialog(false);
      }
    }
  }, [game.status]);

  function validDiscardDueToMixedRole(cardColor) {
    if (game.settings.type !== GameType.MIXED_ROLES) {
      return true;
    }
    if (thisPlayer.team === Team.LIB && thisPlayer.role === Role.FASC) {
      //lib who has to play red is either discarding a blue or they are all red
      return cardColor === Color.BLUE || game.presCards.every(card => card.color === Color.RED);
    } else if (thisPlayer.team === Team.FASC && thisPlayer.role === Role.LIB) {
      //fasc who has to play blue unless all red
      return cardColor === Color.RED || game.presCards.every(card => card.color === Color.BLUE);
    }
    return true;
  }

  function validPlayDueToMixedRole(cardColor) {
    if (game.settings.type !== GameType.MIXED_ROLES) {
      return true;
    }
    if (thisPlayer.team === Team.LIB && thisPlayer.role === Role.FASC) {
      //lib who has to play red is either discarding a blue or they are all red
      return cardColor === Color.RED || game.chanCards.every(card => card.color === Color.BLUE);
    } else if (thisPlayer.team === Team.FASC && thisPlayer.role === Role.LIB) {
      //fasc who has to play blue unless all red
      return cardColor === Color.BLUE || game.chanCards.every(card => card.color === Color.RED);
    }
    return true;
  }

  return (
    <Box sx={{}}>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "50%",
          left: centerContent ? "50%" : "-50%",
          transform: "translate(-50%, -50%)",
          opacity: centerContent ? 1 : 0,
          transition: centerContent ? "left 1s ease-in-out" : "left 0s .4s, opacity .4s ease-in-out",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: { xs: 1, sm: 1, md: 3 },
        }}
      >
        <Typography
          sx={{
            fontSize: `calc(${boardDimensions.x}px / 18)`,
            width: "90%",
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
            fontWeight: "bold",
          }}
        >
          {actionTitle}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            fontSize: `calc(${boardDimensions.x}px / 36)`,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: boardDimensions.x / 70,
              alignItems: "center",
              width: "100%",
            }}
          >
            {actionContent}
          </Box>
          {otherContent}
        </Box>
      </Box>
      <DefaulDiscardDialog
        game={game}
        name={name}
        showDiscardDialog={showDiscardDialog}
        setShowDiscardDialog={setShowDiscardDialog}
        presDiscard={game.presDiscard}
        boardDimensions={boardDimensions}
      />
    </Box>
  );
}

//actioncontent box used to have a gap and justify center, 60% now 100%, make gap depend on size
