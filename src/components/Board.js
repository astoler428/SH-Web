import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import fasc5PlayerBoard from "../img/fasc5PlayerBoard.png";
import fasc7PlayerBoard from "../img/fasc7PlayerBoard.png";
import fasc9PlayerBoard from "../img/fasc9PlayerBoard.png";
import libBoard from "../img/libBoard.png";
import libPolicyPng from "../img/LibPolicy.png";
import fascPolicyPng from "../img/FascPolicy.png";
import policyBackPng from "../img/PolicyBack.png";
import Action from "./Action";
import PolicyPiles from "./PolicyPiles";
import { enactPolicyAnimation, Policy, TOP_DECK_DELAY, ENACT_POLICY_DURATION, RESHUFFLE_DELAY } from "../consts";

//set policy border radius relative to the policyWidth here and everywhere
export default function Board({
  game,
  name,
  id,
  setError,
  showInvCard,
  boardRef,
  boardImageRefs,
  boardDimensions,
  playersDimensions,
  pauseActions,
  setPauseActions,
}) {
  const fascBoard = game.players.length < 7 ? fasc5PlayerBoard : game.players.length < 9 ? fasc7PlayerBoard : fasc9PlayerBoard;
  const [blur, setBlur] = useState(false);
  const [animate, setAnimate] = useState(null);
  const policyWidth = boardDimensions.x / 7.8; //7.68//8.2
  // const policyBorderRadius = policyWidth / 18
  const [boardState, setBoardState] = useState({
    lib: game.LibPoliciesEnacted,
    fasc: game.FascPoliciesEnacted,
    tracker: game.tracker,
  });
  const fascBottom = boardDimensions.x / 2.095; //2.12
  const fascLeft = boardDimensions.x / 10;
  const libBottom = boardDimensions.x / 10.3;
  const libLeft = boardDimensions.x / 5.98;
  const policyGap = boardDimensions.x / 162;
  const trackerWidth = boardDimensions.x / 28.4; //boardDimensions.x / 28.1
  const trackerGap = "11.12%";
  const trackerLeft = "23.1%"; //'33.9%'
  const trackerBottom = "6.5%"; //'7%'

  let policyAnimation = "",
    enactPolicyImg,
    enactPolicyKeyFrames,
    policyDelay = 0;

  useEffect(() => {
    let timeout = 5800;
    if (game.topDecked && (boardState.lib < game.LibPoliciesEnacted || boardState.fasc < game.FascPoliciesEnacted)) {
      //need additional policy check to ensure a refresh doesn't reanimate
      timeout += TOP_DECK_DELAY * 1000;
      if (boardState.lib < game.LibPoliciesEnacted) {
        setAnimate(Policy.LIB);
      } else {
        setAnimate(Policy.FASC);
      }
      setBoardState(prevBoardState => ({ ...prevBoardState, tracker: 3 }));

      setTimeout(() => {
        setAnimate(null);
        setBoardState({
          lib: game.LibPoliciesEnacted,
          fasc: game.FascPoliciesEnacted,
          tracker: game.tracker,
        });
      }, timeout);
      return;
    }
    if (boardState.lib < game.LibPoliciesEnacted) {
      setAnimate(Policy.LIB);
      setTimeout(() => {
        setAnimate(null);
        setBoardState(prevBoardState => ({
          ...prevBoardState,
          lib: game.LibPoliciesEnacted,
        }));
      }, timeout);
    } else if (boardState.fasc < game.FascPoliciesEnacted) {
      setAnimate(Policy.FASC);
      setTimeout(() => {
        setAnimate(null);
        setBoardState(prevBoardState => ({
          ...prevBoardState,
          fasc: game.FascPoliciesEnacted,
        }));
      }, timeout);
    }

    //could refactor now to check game.topdeck
    if (boardState.tracker !== 3 && boardState.tracker !== game.tracker) {
      //advance tracker - if tracker is 3, that means I put it there and in middle of top deck
      const timeout = game.tracker > boardState.tracker ? 0 : RESHUFFLE_DELAY * 1000; //reset tracker at same time as reshuffle would happen
      //check why this didn't cause rerender and console logging animation...
      setTimeout(() => {
        setBoardState(prevBoardState => ({
          ...prevBoardState,
          tracker: game.tracker,
        }));
      }, timeout);
    }
  }, [game.FascPoliciesEnacted, game.LibPoliciesEnacted, game.tracker]); //was game.status

  if (boardState.tracker === 3) {
    policyDelay = TOP_DECK_DELAY;
  }

  if (animate === Policy.LIB) {
    enactPolicyImg = libPolicyPng;
    enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, libLeft, libBottom, policyGap, game.LibPoliciesEnacted);
    policyAnimation = `enact ${ENACT_POLICY_DURATION}s ${policyDelay}s`;
  } else if (animate === Policy.FASC) {
    enactPolicyImg = fascPolicyPng;
    enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, fascLeft, fascBottom, policyGap, game.FascPoliciesEnacted);
    policyAnimation = `enact ${ENACT_POLICY_DURATION}s ${policyDelay}s`;
  }

  const fascCount = boardState.fasc;
  const libCount = boardState.lib;

  const fascPolicies = [];
  for (let i = 0; i < fascCount; i++) {
    fascPolicies.push(<img key={i} draggable="false" src={fascPolicyPng} style={{ width: policyWidth }} />);
  }
  const libPolicies = [];
  for (let i = 0; i < libCount; i++) {
    libPolicies.push(<img key={i} draggable="false" src={libPolicyPng} style={{ width: policyWidth }} />);
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: "100vw", sm: "50vw" },
          maxWidth: { sm: 700 },
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Action
          game={game}
          name={name}
          id={id}
          setError={setError}
          blur={blur}
          setBlur={setBlur}
          showInvCard={showInvCard}
          boardDimensions={boardDimensions}
          playersDimensions={playersDimensions}
          pauseActions={pauseActions}
          setPauseActions={setPauseActions}
        />
        <Box
          ref={boardRef}
          sx={{
            filter: blur ? "contrast(35%) blur(1.5px)" : "blur(0%) contrast(100%)",
            zIndex: -1,
            display: "flex",
            flexDirection: "column",
            transition: "filter .5s",
          }}
        >
          <img ref={el => (boardImageRefs.current[0] = el)} key={1} draggable="false" src={fascBoard} style={{ maxWidth: "100%" }} />
          <img ref={el => (boardImageRefs.current[1] = el)} key={2} draggable="false" src={libBoard} style={{ maxWidth: "100%" }} />
          <Box
            sx={{
              position: "absolute",
              bottom: fascBottom,
              left: fascLeft,
              display: "flex",
              gap: `${policyGap}px`,
            }}
          >
            {fascPolicies}
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: libBottom,
              left: libLeft,
              display: "flex",
              gap: `${policyGap}px`,
            }}
          >
            {libPolicies}
          </Box>
          <style>{enactPolicyKeyFrames}</style>
          <div
            style={{
              position: "absolute",
              zIndex: 100,
              width: policyWidth * 1.4,
              backgroundColor: "transparent",
              display: "flex",
              perspective: 1000,
              left: -1.4 * policyWidth,
              bottom: 0,
              transformStyle: "preserve-3d",
              animation: policyAnimation,
            }}
          >
            {/*First is just a placeholder img to set the size since the absolute images below don't affect size of Box - since lib and fasc images are slightly different sizes its causing a flicker?*/}
            <img src={libPolicyPng} draggable="false" style={{ width: "100%", visibility: "hidden" }} />
            <img
              src={policyBackPng}
              draggable="false"
              style={{
                width: "100%",
                position: "absolute",
                backfaceVisibility: "hidden",
              }}
            />
            <img
              src={enactPolicyImg}
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
              backgroundColor: "blue",
              width: trackerWidth,
              height: trackerWidth,
              borderRadius: "100%",
              position: "absolute",
              bottom: trackerBottom,
              left: `calc(${trackerLeft} + ${boardState.tracker} * ${trackerGap})`,
              transition: "1s left ease-in-out",
            }}
          ></div>
          <PolicyPiles game={game} boardDimensions={boardDimensions} policyWidth={policyWidth} />
        </Box>
      </Box>
    </>
  );
}
