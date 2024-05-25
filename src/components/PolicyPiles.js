import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import PolicyBack from "../img/PolicyBack.png";
import DrawPile from "../img/DrawPile.png";
import DiscardPile from "../img/DiscardPile.png";
import {
  POLICY_PILES_DELAY_BETWEEN_POLICIES,
  POLICY_PILES_INITIAL_DELAY,
  POLICY_PILES_DURATION,
  colors,
  policyPileDownAnimation,
  policyPileUpAnimation,
  Status,
} from "../consts";
import { policyPilesAnimationLength } from "../helperFunctions";

export default function PolicyPiles({ game, boardDimensions, setEnactPolicyDelay, setPoliciesStatusMessage }) {
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

  const descDelay = (idx, val) => POLICY_PILES_INITIAL_DELAY + (val - 1 - idx) * POLICY_PILES_DELAY_BETWEEN_POLICIES;
  // const ascDelay = (idx, val) => POLICY_PILES_INITIAL_DELAY + (val - 1 - idx) * POLICY_PILES_DELAY_BETWEEN_POLICIES;
  const ascDelay = (idx, val) => POLICY_PILES_INITIAL_DELAY + (idx - val) * POLICY_PILES_DELAY_BETWEEN_POLICIES;

  useEffect(() => {
    setPoliciesStatusMessage("");
    if (policyPilesState.drawPile !== drawPileLength || policyPilesState.discardPile !== discardPileLength) {
      let animationLength = 0;

      if (game.status === Status.PRES_DISCARD) {
        setAnimatePolicyPile({ draw: { initial: policyPilesState.drawPile, move: 3, direction: "down" }, discard: null });
        animationLength += policyPilesAnimationLength(3);
        setTimeout(
          () => {
            setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
          },
          drawPileLength === 0 ? POLICY_PILES_INITIAL_DELAY * 1000 : POLICY_PILES_INITIAL_DELAY * 1000 // : animationLength * 1000
        );
      } else if (game.status === Status.CHAN_PLAY) {
        setAnimatePolicyPile({ draw: null, discard: { initial: policyPilesState.discardPile, move: 1, direction: "up" } });
        animationLength += policyPilesAnimationLength(1);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile, discardPile: policyPilesState.discardPile + 1 });
        }, POLICY_PILES_INITIAL_DELAY * 1000);
      } else if (!game.vetoAccepted && !game.topDecked) {
        //might work - when else is policyPileCount different from no vetoAccepted, no topDeck?
        //would have to be a status resembling chan_claim -> maybe game over lib or fasc or libspyguess
        setPoliciesStatusMessage("Enacting a policy");
        setAnimatePolicyPile({ draw: null, discard: { initial: policyPilesState.discardPile, move: 1, direction: "up" } });
        setEnactPolicyDelay(animationLength);
        animationLength += policyPilesAnimationLength(1);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile, discardPile: policyPilesState.discardPile + 1 });
        }, POLICY_PILES_INITIAL_DELAY * 1000);
      } else if (game.vetoAccepted) {
        setAnimatePolicyPile({ draw: null, discard: { initial: policyPilesState.discardPile, move: 2, direction: "up" } });
        animationLength += policyPilesAnimationLength(2);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile, discardPile: policyPilesState.discardPile + 2 });
        }, POLICY_PILES_INITIAL_DELAY * 1000);
        /**
         *
         */
        if (game.deck.reshuffleIsBeforeATopDeck) {
          //case of vetoAccepted and fewer than 3 cards once veto accepted -> reshuffle then top deck
          if (game.deck.justReshuffled) {
            setPoliciesStatusMessage("Reshuffling the deck");
            setTimeout(() => {
              setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
              setAnimatePolicyPile({
                draw: { initial: policyPilesState.drawPile, move: policyPilesState.discardPile + 2, direction: "up" },
                discard: { initial: policyPilesState.discardPile + 2, move: policyPilesState.discardPile + 2, direction: "down" },
              });
            }, animationLength * 1000);
            animationLength += policyPilesAnimationLength(policyPilesState.discardPile + 3);
            setTimeout(() => {
              setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile + policyPilesState.discardPile + 2, discardPile: 0 });
              setPolicyPilesState({ drawPile: policyPilesState.drawPile + policyPilesState.discardPile + 2, discardPile: 0 });
            }, animationLength * 1000);
          }
          if (game.topDecked) {
            if (!game.deck.justReshuffled) {
              //immediately say top deck as it's the first status
              setPoliciesStatusMessage("Enacting a policy");
            }
            setTimeout(() => {
              setPoliciesStatusMessage("Enacting a policy");
              setAnimatePolicyPile({
                draw: { initial: drawPileLength + 1, move: 1, direction: "down" },
                discard: null,
              });
            }, animationLength * 1000);
            setTimeout(() => {
              setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
            }, (animationLength + POLICY_PILES_INITIAL_DELAY) * 1000);
            animationLength += policyPilesAnimationLength(1);
            setEnactPolicyDelay(animationLength);
          }
        } else {
          //case of vetoAccepted and not than 3 cards once veto accepted, possible reshuffle if 3 cards left after veto -> top deck causes reshuffle
          if (game.topDecked) {
            setPoliciesStatusMessage("Enacting a policy");
            setTimeout(() => {
              setAnimatePolicyPile({
                draw: { initial: policyPilesState.drawPile, move: 1, direction: "down" },
                discard: null,
              });
              setTimeout(() => {
                setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile - 1, discardPile: policyPilesState.discardPile });
              }, POLICY_PILES_INITIAL_DELAY * 1000);
            }, animationLength * 1000);
            animationLength += policyPilesAnimationLength(1);
            setEnactPolicyDelay(animationLength);
          }
          if (game.deck.justReshuffled) {
            if (game.topDecked) {
              setTimeout(() => {
                setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
                setAnimatePolicyPile({
                  draw: { initial: policyPilesState.drawPile - 1, move: policyPilesState.discardPile, direction: "up" },
                  discard: { initial: policyPilesState.discardPile, move: policyPilesState.discardPile, direction: "down" },
                });
              }, animationLength * 1000);
              animationLength += policyPilesAnimationLength(policyPilesState.discardPile);
            } else {
              setTimeout(() => {
                setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
                setAnimatePolicyPile({
                  draw: { initial: policyPilesState.drawPile, move: policyPilesState.discardPile + 2, direction: "up" },
                  discard: { initial: policyPilesState.discardPile + 2, move: policyPilesState.discardPile + 2, direction: "down" },
                });
              }, animationLength * 1000);
              animationLength += policyPilesAnimationLength(policyPilesState.discardPile + 2);
            }
            setTimeout(() => {
              setPolicyPileCountDisplay({ drawPile: drawPileLength, discardPile: discardPileLength });
            }, animationLength * 1000);
          }
        }
      } else if (game.topDecked) {
        setPoliciesStatusMessage("Enacting a policy");
        setAnimatePolicyPile({
          draw: { initial: policyPilesState.drawPile, move: 1, direction: "down" },
          discard: null,
        });
        animationLength += policyPilesAnimationLength(1);
        setEnactPolicyDelay(animationLength);
        setTimeout(() => {
          setPolicyPileCountDisplay({ drawPile: policyPilesState.drawPile - 1, discardPile: policyPilesState.discardPile });
        }, POLICY_PILES_INITIAL_DELAY * 1000);
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
          animationLength += policyPilesAnimationLength(policyPilesState.discardPile);
        } else {
          setTimeout(() => {
            setPolicyPileCountDisplay({ drawPile: 0, discardPile: 0 });
            setAnimatePolicyPile({
              draw: { initial: policyPilesState.drawPile, move: policyPilesState.discardPile + 1, direction: "up" },
              discard: { initial: policyPilesState.discardPile + 1, move: policyPilesState.discardPile + 1, direction: "down" },
            });
          }, animationLength * 1000);
          animationLength += policyPilesAnimationLength(policyPilesState.discardPile + 1);
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

  function initAnimationPolicyPile(initial, move, direction, pile) {
    const totalPolicies = direction === "up" ? initial + move : initial;
    for (let i = 0; i < totalPolicies; i++) {
      let top, animation;
      if (direction === "down") {
        top = 0;
        animation = i >= totalPolicies - move ? `${POLICY_PILES_DURATION}s policyPileDown ${descDelay(i, totalPolicies)}s forwards` : "";
      } else {
        top = i >= totalPolicies - move ? policyPilesWidth * 1.45 : 0;
        animation = i >= totalPolicies - move ? `${POLICY_PILES_DURATION}s policyPileUp ${ascDelay(i, totalPolicies - move)}s forwards` : "";
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
    <Box sx={{ display: "flex", gap: 1, position: "relative" }}>
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
