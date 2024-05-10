import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import PolicyBack from "../img/PolicyBack.png";
import DrawPile from "../img/DrawPile.png";
import DiscardPile from "../img/DiscardPile.png";
import { TOP_DECK_DELAY, RESHUFFLE_DELAY, colors, policyPileDownAnimation, policyPileUpAnimation, Status } from "../consts";

export default function PolicyPiles({ game, boardDimensions }) {
  // const horizontal = boardDimensions.x/35
  // const vertical = boardDimensions.x/3.3 //2.1
  const drawPileLength = game.deck.drawPile.length;
  const discardPileLength = game.deck.discardPile.length;
  const [policyPilesState, setPolicyPilesState] = useState({
    drawPile: drawPileLength,
    discardPile: discardPileLength,
  });
  const [policyPileCountDisplay, setPolicyPileCountDisplay] = useState({
    drawPile: drawPileLength,
    discardPile: discardPileLength,
  });
  const [animatePolicyPile, setAnimatePolicyPile] = useState({ draw: null, discard: null });

  const initialDelay = 0.3;
  const delayBetweenPolicies = 0.2;
  const policyPileAnimationDuration = 1;

  const policyPilesWidth = boardDimensions.x / 12;
  const policyPileDownKeyFrames = policyPileDownAnimation(policyPilesWidth * 1.45);
  const policyPileUpKeyFrames = policyPileUpAnimation(policyPilesWidth * 1.45);
  const countStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    color: colors.hidden,
    backgroundColor: "#302F2F",
    fontFamily: "inter",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: boardDimensions.x / 35,
    height: boardDimensions.x / 35,
    fontWeight: "bold",
    borderRadius: boardDimensions.x / 1800,
    fontSize: boardDimensions.x / 48,
  };

  const drawPilePolicies = [];
  const discardPilePolicies = [];

  const descDelay = (idx, val) => initialDelay + (val - 1 - idx) * delayBetweenPolicies;
  // const ascDelay = (idx, val) => initialDelay + (val - 1 - idx) * delayBetweenPolicies;
  const ascDelay = (idx, val) => initialDelay + (idx - val) * delayBetweenPolicies;

  //timeouts
  //set count state
  //set policyPileState -> at end of total timeout

  useEffect(() => {
    if (policyPilesState.drawPile !== drawPileLength || policyPilesState.discardPile !== discardPileLength) {
      let animationLength = 0;

      if (game.status === Status.PRES_DISCARD) {
        setAnimatePolicyPile({ draw: { initial: policyPilesState.drawPile, move: 3, direction: "down" }, discard: null });
        animationLength += getAnimationLength(3);
        setTimeout(
          () => {
            setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
          },
          drawPileLength === 0 ? initialDelay * 1000 : animationLength * 1000
        );
      } else if (game.status === Status.CHAN_PLAY || game.status === Status.CHAN_CLAIM) {
        setAnimatePolicyPile({ draw: null, discard: { initial: policyPilesState.discardPile, move: 1, direction: "up" } });
        animationLength += getAnimationLength(1);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
        }, animationLength * 1000);
      } else if (game.vetoAccepted) {
        setAnimatePolicyPile({ draw: null, discard: { initial: policyPilesState.discardPile, move: 2, direction: "up" } });
        animationLength += getAnimationLength(2);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile, discardPile: policyPilesState.discardPile + 2 });
        }, animationLength * 1000);
        if (game.deck.justReshuffled) {
          setTimeout(() => {
            setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
            setAnimatePolicyPile({
              draw: { initial: policyPilesState.drawPile, move: policyPilesState.discardPile + 2, direction: "up" },
              discard: { initial: policyPilesState.discardPile + 2, move: policyPilesState.discardPile + 2, direction: "down" },
            });
          }, animationLength * 1000);
          animationLength += getAnimationLength(policyPilesState.discardPile + 3);
          setTimeout(() => {
            setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile + policyPilesState.discardPile + 2, discardPile: 0 });
            setPolicyPilesState({ drawPile: policyPilesState.drawPile + policyPilesState.discardPile + 2, discardPile: 0 });
          }, animationLength * 1000);
        }
        if (game.topDecked) {
          setTimeout(() => {
            setAnimatePolicyPile({
              draw: { initial: drawPileLength + 1, move: 1, direction: "down" },
              discard: null,
            });
          }, animationLength * 1000);
          animationLength += getAnimationLength(1);
          setTimeout(() => {
            setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
          }, animationLength * 1000);
        }
      } else if (game.topDecked) {
        setAnimatePolicyPile({
          draw: { initial: policyPilesState.drawPile, move: 1, direction: "down" },
          discard: null,
        });
        animationLength += getAnimationLength(1);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
        }, animationLength * 1000);
      }
      if (!game.vetoAccepted && game.deck.justReshuffled) {
        if (game.topDecked) {
          setTimeout(() => {
            setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
            setAnimatePolicyPile({
              draw: { initial: policyPilesState.drawPile - 1, move: policyPilesState.discardPile, direction: "up" },
              discard: { initial: policyPilesState.discardPile, move: policyPilesState.discardPile, direction: "down" },
            });
          }, animationLength * 1000);
          animationLength += getAnimationLength(policyPilesState.discardPile);
        } else {
          setTimeout(() => {
            setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
            setAnimatePolicyPile({
              draw: { initial: policyPilesState.drawPile, move: policyPilesState.discardPile + 1, direction: "up" },
              discard: { initial: policyPilesState.discardPile + 1, move: policyPilesState.discardPile + 1, direction: "down" },
            });
          }, animationLength * 1000);
          animationLength += getAnimationLength(policyPilesState.discardPile + 2);
        }
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
        }, animationLength * 1000);
      }

      setTimeout(() => {
        setPolicyPilesState({
          drawPile: drawPileLength,
          discardPile: discardPileLength,
        });
        setAnimatePolicyPile({ draw: null, discard: null });
        setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
      }, animationLength * 1000);
    } else {
      setAnimatePolicyPile({ draw: null, discard: null });
    }
  }, [game.status]);

  if (animatePolicyPile.draw) {
    initAnimationPolicyPile(animatePolicyPile.draw.initial, animatePolicyPile.draw.move, animatePolicyPile.draw.direction, drawPilePolicies);
  } else {
    noAnimationPolicyPile("draw");
  }
  if (animatePolicyPile.discard) {
    initAnimationPolicyPile(
      animatePolicyPile.discard.initial,
      animatePolicyPile.discard.move,
      animatePolicyPile.discard.direction,
      discardPilePolicies
    );
  } else {
    noAnimationPolicyPile("discard");
  }

  function noAnimationPolicyPile(pileType) {
    if (pileType === "draw") {
      for (let i = 0; i < policyPilesState.drawPile; i++) {
        drawPilePolicies.push(<img src={PolicyBack} key={i} draggable="false" style={{ position: "absolute", top: 0, left: 0, width: "100%" }} />);
      }
    } else {
      for (let i = 0; i < policyPilesState.discardPile; i++) {
        discardPilePolicies.push(<img src={PolicyBack} key={i} draggable="false" style={{ position: "absolute", top: 0, left: 0, width: "100%" }} />);
      }
    }
  }

  function getAnimationLength(move) {
    return initialDelay + policyPileAnimationDuration + delayBetweenPolicies * (move - 1);
  }

  function initAnimationPolicyPile(initial, move, direction, pile) {
    const totalPolicies = direction === "up" ? initial + move : initial;
    for (let i = 0; i < totalPolicies; i++) {
      let top, animation;
      if (direction === "down") {
        top = 0;
        animation = i >= totalPolicies - move ? `${policyPileAnimationDuration}s policyPileDown ${descDelay(i, totalPolicies)}s forwards` : "";
      } else {
        top = i >= totalPolicies - move ? policyPilesWidth * 1.45 : 0;
        animation = i >= totalPolicies - move ? `${policyPileAnimationDuration}s policyPileUp ${ascDelay(i, totalPolicies - move)}s forwards` : "";
      }
      pile.push(
        <img
          src={PolicyBack}
          key={i}
          draggable="false"
          style={{
            position: "absolute",
            top,
            left: 0,
            width: "100%",
            animation,
          }}
        />
      );
    }
  }

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <style>{policyPileDownKeyFrames}</style>
      <style>{policyPileUpKeyFrames}</style>
      <Box
        sx={{
          position: "absolute",
          left: boardDimensions.x / 22.5,
          bottom: boardDimensions.x / 9.8,
          width: policyPilesWidth * 1.25,
        }}
      >
        <img src={DrawPile} draggable="false" style={{ width: "100%" }} />
        <Box
          sx={{
            position: "absolute",
            overflow: "hidden",
            left: boardDimensions.x / 95,
            bottom: boardDimensions.x / 30,
            width: policyPilesWidth,
            display: "flex",
          }}
        >
          <img className="find-me" src={PolicyBack} draggable="false" style={{ width: "100%", visibility: "hidden" }} />
          {drawPilePolicies}
          <Box
            sx={{
              ...countStyles,
              visibility: policyPileCountDisplay.drawPile === 0 ? "hidden" : "visible",
            }}
          >
            {policyPileCountDisplay.drawPile}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: boardDimensions.x / 22.2,
          bottom: boardDimensions.x / 9.8,
          width: policyPilesWidth * 1.25,
        }}
      >
        <img src={DiscardPile} draggable="false" style={{ width: "100%" }} />
        <Box
          sx={{
            position: "absolute",
            overflow: "hidden",
            left: boardDimensions.x / 95,
            bottom: boardDimensions.x / 30,
            width: policyPilesWidth,
            display: "flex",
          }}
        >
          <img src={PolicyBack} draggable="false" style={{ width: "100%", visibility: "hidden" }} />
          {discardPilePolicies}
          <Box
            sx={{
              ...countStyles,
              visibility: policyPileCountDisplay.discardPile === 0 ? "hidden" : "visible",
            }}
          >
            {policyPileCountDisplay.discardPile}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/**
 *
  useEffect(() => {
    if (game.topDecked && game.vetoAccepted && drawPileLength > policyPilesState.drawPile) {
      //veto accepted causes reshuffle into top deck
      setReadyToReshuffle(true);
      setTimeout(
        () =>
          setPolicyPileCountDisplay(prevState => ({
            ...prevState,
            discardPile: 0,
          })),
        initialDelay * 1000
      );
      setTimeout(() => {
        setPolicyPileCountDisplay(prevState => ({
          ...prevState,
          drawPile: drawPileLength + 1,
          discardPile: discardPileLength,
        }));
        setPolicyPilesState({
          drawPile: drawPileLength + 1,
          discardPile: discardPileLength,
        });
        setReadyToReshuffle(false);
      }, drawPileAnimationTotalLength * 1000);
      setTimeout(() => {
        setPolicyPileCountDisplay(prevState => ({
          ...prevState,
          drawPile: drawPileLength,
        }));
        setPolicyPilesState({
          drawPile: drawPileLength,
          discardPile: discardPileLength,
        });
      }, (drawPileAnimationTotalLength + initialDelay + policyPileAnimationDuration) * 1000);
      return;
    }
    if (game.topDecked && drawPileLength > policyPilesState.drawPile) {
      //means reshuffled

      setTimeout(
        () =>
          setPolicyPileCountDisplay(prevState => ({
            ...prevState,
            drawPile: prevState.drawPile - 1,
          })),
        (initialDelay + policyPileAnimationDuration) * 1000
      );
      setTimeout(() => {
        setReadyToReshuffle(true);

        //can combine same timeouts into one
        setTimeout(
          () =>
            setPolicyPilesState({
              drawPile: drawPileLength,
              discardPile: discardPileLength,
            }),
          drawPileAnimationTotalLength * 1000
        );
        setTimeout(
          () =>
            setPolicyPileCountDisplay(prevState => ({
              ...prevState,
              drawPile: drawPileLength,
            })),
          drawPileAnimationTotalLength * 1000
        );
        setTimeout(
          () =>
            setPolicyPileCountDisplay(prevState => ({
              ...prevState,
              discardPile: 0,
            })),
          initialDelay * 1000
        );
      }, (RESHUFFLE_DELAY + TOP_DECK_DELAY) * 1000); //(TOP_DECK_DELAY + policyPileAnimationDuration) * 1000); //was 2500
      return;
    }
    setReadyToReshuffle(false);
    if (policyPilesState.drawPile !== drawPileLength) {
      const timeoutDelay = 0;
      setTimeout(() => {
        if (drawPileLength > policyPilesState.drawPile) {
          setReadyToReshuffle(true);
        }
        setTimeout(
          () =>
            setPolicyPileCountDisplay(prevState => ({
              ...prevState,
              drawPile: drawPileLength,
            })),
          drawPileLength === 0 ? initialDelay * 1000 : drawPileAnimationTotalLength * 1000
        );
        setTimeout(
          () =>
            setPolicyPilesState(prevState => ({
              ...prevState,
              drawPile: drawPileLength,
            })),
          drawPileAnimationTotalLength * 1000
        ); //8000
      }, timeoutDelay);
    }
    if (policyPilesState.discardPile !== discardPileLength) {
      const timeoutDelay = 0;

      setTimeout(() => {
        // setReadyToReshuffle(true); handling this in drawPile case above
        setTimeout(
          () =>
            setPolicyPileCountDisplay(prevState => ({
              ...prevState,
              discardPile: discardPileLength,
            })),
          discardPileLength === 0 ? initialDelay * 1000 : discardPileAnimationTotalLength * 1000
        );
        setTimeout(
          () =>
            setPolicyPilesState(prevState => ({
              ...prevState,
              discardPile: discardPileLength,
            })),
          discardPileAnimationTotalLength * 1000
        );
      }, timeoutDelay);
    }
  }, [drawPileLength, discardPileLength]); //game.status game.deck.drawPile.length, game.deck.discardPile.length
 */
