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
import { enactPolicyAnimation, Policy, ENACT_POLICY_DURATION } from "../consts";

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
  setPoliciesStatusMessage,
}) {
  const fascBoard = game.players.length < 7 ? fasc5PlayerBoard : game.players.length < 9 ? fasc7PlayerBoard : fasc9PlayerBoard;
  const [blur, setBlur] = useState(false);
  const [animate, setAnimate] = useState(null);
  const policyWidth = boardDimensions.x / 7.8;
  const [boardState, setBoardState] = useState({
    lib: game.LibPoliciesEnacted,
    fasc: game.FascPoliciesEnacted,
    tracker: game.tracker,
  });
  const [enactPolicyDelay, setEnactPolicyDelay] = useState(null);
  const fascBottom = boardDimensions.x / 2.095;
  const fascLeft = boardDimensions.x / 10;
  const libBottom = boardDimensions.x / 10.3;
  const libLeft = boardDimensions.x / 5.98;
  const policyGap = boardDimensions.x / 162;
  const trackerWidth = boardDimensions.x / 28.4;
  const trackerGap = "11.12%";
  const trackerLeft = "23.1%";
  const trackerBottom = "6.5%";

  let policyAnimation = "",
    enactPolicyImg,
    enactPolicyKeyFrames;

  useEffect(() => {
    if (enactPolicyDelay !== null) {
      setTimeout(() => {
        if (boardState.lib < game.LibPoliciesEnacted) {
          setAnimate(Policy.LIB);
        } else if (boardState.fasc < game.FascPoliciesEnacted) {
          setAnimate(Policy.FASC);
        }
      }, enactPolicyDelay * 1000);

      setTimeout(() => {
        setAnimate(null);
        setEnactPolicyDelay(null);
        setBoardState({
          lib: game.LibPoliciesEnacted,
          fasc: game.FascPoliciesEnacted,
          tracker: game.tracker,
        });
      }, (ENACT_POLICY_DURATION + enactPolicyDelay) * 1000);
    }

    if (game.topDecked && boardState.tracker === 2) {
      setBoardState(prevBoardState => ({ ...prevBoardState, tracker: 3 }));
    }

    if (game.tracker > boardState.tracker) {
      setBoardState(prevBoardState => ({
        ...prevBoardState,
        tracker: game.tracker,
      }));
    }
  }, [game.FascPoliciesEnacted, game.LibPoliciesEnacted, game.tracker, enactPolicyDelay]); //was game.status

  if (animate === Policy.LIB) {
    enactPolicyImg = libPolicyPng;
    enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, libLeft, libBottom, policyGap, game.LibPoliciesEnacted);
    policyAnimation = `enact ${ENACT_POLICY_DURATION}s forwards`;
  } else if (animate === Policy.FASC) {
    enactPolicyImg = fascPolicyPng;
    enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, fascLeft, fascBottom, policyGap, game.FascPoliciesEnacted);
    policyAnimation = `enact ${ENACT_POLICY_DURATION}s forwards`;
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
          <PolicyPiles
            game={game}
            boardDimensions={boardDimensions}
            policyWidth={policyWidth}
            setEnactPolicyDelay={setEnactPolicyDelay}
            setPoliciesStatusMessage={setPoliciesStatusMessage}
          />
        </Box>
      </Box>
    </>
  );
}
