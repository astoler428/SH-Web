import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, TextField, Typography, ListItem, Button } from "@mui/material";
import { Team, Status, LogType, Role, Policy, GameType, colors } from "../consts";
import { inGov, gameOver, isBlindSetting } from "../helperFunctions";
import { socket } from "../socket";
import StatusMessage from "./StatusMessage";
import Game from "../pages/Game";

export default function LogChat({
  game,
  name,
  boardDimensions,
  playersDimensions,
  hitlerFlippedForLibSpyGuess,
  pauseActions,
  policiesStatusMessage,
}) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef(undefined);
  const paperRef = useRef(undefined);
  const messageInputRef = useRef(undefined);

  const thisPlayer = game.players.find(player => player.name === name);
  const disabled = !gameOver(game.status) && (!thisPlayer.alive || inGov(game, name) || game.status === Status.LIB_SPY_GUESS);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (paperRef.current.scrollHeight - paperRef.current.clientHeight - Math.round(paperRef.current.scrollTop) < 80) {
      paperRef.current.scrollTo({
        behavior: "auto",
        top: paperRef.current.scrollHeight,
      });
    }
    // const scrollLabelRect = scrollRef.current.getBoundingClientRect()
    // const textFieldRect = messageInputRef.current.getBoundingClientRect()
    // if(textFieldRect.bottom - scrollLabelRect.bottom > -20){
    //   scrollRef.current?.scrollIntoView({behavior: 'auto', block: 'start'})
    // }
  }, [game]);

  function sendMessage(e) {
    e.preventDefault();
    if (message) {
      socket.emit("chat", { id: game.id, name, message });
      setMessage("");
    }
  }

  function handleKeyPress(e) {
    if (
      messageInputRef?.current !== document.activeElement &&
      e.key !== "Enter" &&
      e.key.length === 1 &&
      !e.getModifierState("Control") &&
      !e.getModifierState("Meta") &&
      !e.getModifierState("Alt")
    ) {
      messageInputRef?.current?.focus();
    }
  }

  function renderPolicies(policyStr) {
    if (!policyStr) {
      return;
    }
    return policyStr.split("").map((char, idx) => (
      <span
        key={idx}
        style={{
          fontWeight: 700,
          color: char === "R" ? colors.fasc : colors.lib,
        }}
      >
        {char}
      </span>
    ));
  }

  function renderName(name) {
    const thisPlayer = game.players.find(player => player.name === name);
    const playerNum = game.players.indexOf(thisPlayer) + 1;
    return (
      <span style={{ fontWeight: 700, color: thisPlayer.color }}>
        {name} &#123;{playerNum}&#125;
      </span>
    );
  }

  function renderRole(role, plural = false, opts = "") {
    return (
      <span
        style={{
          fontWeight: 700,
          color: role === Role.HITLER ? colors.hitler : role === Role.FASC ? colors.fasc : colors.lib,
        }}
      >
        {opts}
        {role}
        {plural ? "s" : ""}
      </span>
    );
  }

  function renderTeam(team, plural = false, opts = "") {
    return (
      <span
        style={{
          fontWeight: 700,
          color: team === Team.FASC ? colors.fasc : colors.lib,
        }}
      >
        {opts}
        {team}
        {plural ? "s" : ""}
      </span>
    );
  }

  function renderDate(date, fontSize) {
    const localDate = new Date(date);
    const addLeadingZero = val => (val < 10 ? `0${val}` : `${val}`);
    const hours = addLeadingZero(localDate.getHours());
    const minutes = addLeadingZero(localDate.getMinutes());
    const seconds = addLeadingZero(localDate.getSeconds());

    return (
      <span
        style={{
          display: "inline-block",
          fontSize, //: ".65em", but parent is 1em vs .93em so now passing in em to account for difference
          fontFamily: "roboto",
          color: "#a7a7a8",
          fontWeight: 700,
          marginRight: "3px",
        }}
      >
        {`${hours}:${minutes}:${seconds}`}
      </span>
    );
  }

  const presidentStr = <span style={{ color: "gold", fontWeight: 800 }}>President</span>;
  const chancellorStr = <span style={{ color: "gold", fontWeight: 800 }}>Chancellor</span>;
  const claimsStr = <span style={{ color: "gold", fontWeight: 800 }}>claims</span>;
  const liberalStr = renderRole(Role.LIB);
  const liberalsStr = renderRole(Role.LIB, true);
  const fascistStr = renderRole(Role.FASC);
  const fascistsStr = renderRole(Role.FASC, true);
  const hitlerStr = renderRole(Role.HITLER);
  const liberalSpyStr = renderRole(Role.LIB_SPY);

  let log = game.log;
  if (thisPlayer.team === Team.LIB || thisPlayer.role === Role.HITLER) {
    log = log.filter(entry => entry.type !== LogType.HITLER_SEAT);
  }
  if (
    thisPlayer.team === Team.LIB ||
    (game.players.length < 7 && thisPlayer.role !== Role.HITLER) ||
    (thisPlayer.role === Role.HITLER && !game.settings.hitlerKnowsFasc)
  ) {
    log = log.filter(entry => entry.type !== LogType.OTHER_FASCIST_SEATS);
  }

  log = log.map((entry, i) => {
    const dateStr = renderDate(entry.date);

    if (!entry.type) {
      return (
        <ListItem key={i} sx={{ margin: "0", padding: "0", paddingLeft: "5px" }}>
          <Typography
            sx={{
              marginLeft: "0px",
              fontFamily: "inter",
              fontWeight: 800,
              color: "#e5e5e5",
              fontSize: "1em",
            }}
          >
            {renderDate(entry.date, ".65em")}
            {renderName(entry.name)}
            <span style={{ fontWeight: 500, fontSize: "1em" }}>:</span> {entry.message}
          </Typography>
        </ListItem>
      );
    }

    const pres = entry.payload?.pres && renderName(entry.payload.pres);
    const chan = entry.payload?.chan && renderName(entry.payload.chan);
    const investigatee = entry.payload?.investigatee && renderName(entry.payload.investigatee);
    const name = entry.payload?.name && renderName(entry.payload.name);
    const claim = entry.payload?.claim && entry.payload.claim;

    let logEntry;

    switch (entry.type) {
      case LogType.INTRO_DECK:
        logEntry = (
          <span>
            The deck is shuffled: {renderRole(Role.LIB, false, `6 `)} and {renderRole(Role.FASC, false, `${game.settings.redDown ? 10 : 11} `)}{" "}
            policies.
          </span>
        );
        break;
      case LogType.INTRO_ROLES:
        logEntry = (
          <span>
            The roles are dealt with {Math.ceil((game.players.length + 1) / 2)} {liberalsStr} and {Math.floor((game.players.length - 1) / 2)}{" "}
            {fascistsStr}.
          </span>
        );
        break;
      case LogType.INTRO_LIB_SPY:
        logEntry = (
          <span>
            One of the {liberalsStr} is the {liberalSpyStr}.
          </span>
        );
        break;
      case LogType.INTRO_MIXED:
        logEntry = (
          <span>
            {hitlerStr} is a {fascistStr} but other party membership and roles may be mixed. Your party membership is your team. Your role is the
            policies you play.
          </span>
        );
        break;
      case LogType.COOPERATIVE_BLIND:
        logEntry = (
          <span>
            You control the vote and player selection for this role. However, regardless of this player's role, your objective is to cooperative with
            the other players to make the liberals win.
          </span>
        );
        break;
      case LogType.INTRO_HITLER_KNOWS_FASC:
        logEntry = (
          <span>
            {hitlerStr} knows the other {game.players.length >= 7 ? fascistsStr : fascistStr}.
          </span>
        );
        break;
      case LogType.INTRO_RED_DOWN:
        logEntry = <span>The game begins with a {fascistStr} policy enacted.</span>;
        break;
      case LogType.INDIVIDUAL_SEAT:
        let rolePhrase = "";
        if (game.settings.type === GameType.MIXED_ROLES) {
          rolePhrase = (
            <span>
              the {renderTeam(thisPlayer.team)} team and {renderRole(thisPlayer.role)}
            </span>
          );
        } else if (isBlindSetting(game.settings.type)) {
          // if (game.settings.type === GameType.TOTALLY_BLIND) {
          //   rolePhrase = <span>the {renderRole(thisPlayer.identity)} identity and a hidden</span>;
          // } else {
          //   rolePhrase = <span>a hidden</span>;
          // }
          rolePhrase = <span>a hidden</span>;
        } else {
          rolePhrase = <span>the {renderRole(thisPlayer.role)}</span>;
        }
        const seatNum = game.players.indexOf(thisPlayer) + 1;
        logEntry = (
          <span>
            You receive {rolePhrase} role and take seat <span style={{ color: "#e5e5e5", fontWeight: 700 }}>#{seatNum}</span>.
          </span>
        );
        break;
      case LogType.HITLER_SEAT:
        const hitlerPlayer = game.players.find(player => player.role === Role.HITLER);
        logEntry = (
          <span>
            You see that {hitlerStr} is {renderName(hitlerPlayer.name)}.
          </span>
        );
        break;
      case LogType.OTHER_FASCIST_SEATS:
        const otherFasc = game.players.filter(player => player.team === Team.FASC && player.role !== Role.HITLER && player.name !== thisPlayer.name);
        if (game.players.length >= 9 && thisPlayer.role === Role.HITLER) {
          logEntry = (
            <span>
              You see that the other {fascistsStr} are {renderName(otherFasc[0].name)}, {renderName(otherFasc[1].name)} and{" "}
              {renderName(otherFasc[2].name)}.{" "}
            </span>
          );
        } else if (game.players.length >= 9 || (game.players.length >= 7 && thisPlayer.role === Role.HITLER)) {
          logEntry = (
            <span>
              You see that the other {fascistsStr} are {renderName(otherFasc[0].name)} and {renderName(otherFasc[1].name)}.{" "}
            </span>
          );
        } else {
          logEntry = (
            <span>
              You see that the other {fascistStr} is {renderName(otherFasc[0].name)}.{" "}
            </span>
          );
        }
        break;
      case LogType.CHOOSE_CHAN:
        logEntry = (
          <span>
            {pres} nominates {chan} as chancellor.
          </span>
        );
        break;
      case LogType.ENACT_POLICY:
        const policy = entry.payload.policy;
        logEntry = <span>A {policy === Policy.FASC ? fascistStr : liberalStr} policy is enacted.</span>;
        break;
      case LogType.CHAN_CLAIM:
        logEntry = (
          <span>
            {chancellorStr} {chan} {claimsStr} {renderPolicies(claim)}.
          </span>
        );
        break;
      case LogType.PRES_CLAIM:
        logEntry = (
          <span>
            {presidentStr} {pres} {claimsStr} {renderPolicies(claim)}.
          </span>
        );
        break;
      case LogType.INV:
        logEntry = (
          <span>
            {presidentStr} {pres} investigates {investigatee}.
          </span>
        );
        break;
      case LogType.INV_CLAIM:
        logEntry = (
          <span>
            {presidentStr} {pres} {claimsStr} {investigatee} is {renderRole(claim)}.
          </span>
        );
        break;
      case LogType.SE:
        const seName = renderName(entry.payload.seName);
        logEntry = (
          <span>
            {presidentStr} {pres} special elects {seName}.
          </span>
        );
        break;
      case LogType.INSPECT_TOP3:
        logEntry = (
          <span>
            {presidentStr} {pres} looks at the top 3 policies.
          </span>
        );
        break;
      case LogType.INSPECT_TOP3_CLAIM:
        logEntry = (
          <span>
            {presidentStr} {pres} claims the top 3 policies are {renderPolicies(claim)}. The 3 policies are shuffled and then returned to the top of
            the deck.
          </span>
        );
        break;
      case LogType.GUN:
        const shotName = renderName(entry.payload.shotName);
        logEntry = (
          <span>
            {presidentStr} {pres} shoots {shotName}.
          </span>
        );
        break;
      case LogType.VETO_REQUEST:
        logEntry = (
          <span>
            {chancellorStr} {chan} requests a veto.
          </span>
        );
        break;
      case LogType.VETO_REPLY:
        const vetoAccepted = entry.payload.vetoAccepted;
        logEntry = vetoAccepted ? (
          <span>
            {presidentStr} {pres} accepts veto. The election tracker moves forward.
          </span>
        ) : (
          <span>
            {presidentStr} {pres} declines veto.
          </span>
        );
        break;
      case LogType.CONFIRM_FASC:
        logEntry = (
          <span>
            {name} tried to confirm as {fascistStr}, but was {liberalStr}.
          </span>
        );
        break;
      case LogType.ELECTION_FAIL:
        logEntry = <span>The election fails and the election tracker moves forward.</span>;
        break;
      case LogType.TOP_DECK:
        logEntry = <span>Three failed elections. Top decking.</span>;
        break;

      case LogType.HITLER_TO_GUESS_LIB_SPY:
        logEntry = (
          <span>
            The {liberalsStr} enacted 5 {liberalStr} policies and the {liberalSpyStr} played a {renderPolicies("R")} policy.
          </span>
        );
        break;
      case LogType.LIB_SPY_GUESS:
        const spyName = renderName(entry.payload.spyName);
        logEntry = (
          <span>
            {hitlerStr} guesses {spyName} to be the liberal spy.
          </span>
        );
        break;
      case LogType.SHUFFLE_DECK:
        const libCount = renderRole(Role.LIB, false, `${entry.payload.libCount} `);
        const fascCount = renderRole(Role.FASC, false, `${entry.payload.fascCount} `);
        logEntry = (
          <span>
            The deck is shuffled: {libCount} and {fascCount} policies.
          </span>
        );
        break;
      case LogType.LIB_WIN:
        logEntry = <span>The {liberalsStr} win the game.</span>;
        break;
      case LogType.FASC_WIN:
        logEntry = <span>The {fascistsStr} win the game.</span>;
        break;
      case LogType.LIB_SPY_WIN:
        logEntry = <span>The {liberalSpyStr} wins the game.</span>;
        break;
      case LogType.LIB_SPY_FAIL:
        const B = renderPolicies("B");
        logEntry = (
          <span>
            The {liberalSpyStr} failed to play a {B} policy.
          </span>
        );
        break;
      case LogType.HITLER_ELECTED:
        logEntry = <span>{hitlerStr} has been elected chancellor.</span>;
        break;
      case LogType.HITLER_SHOT:
        logEntry = <span>{hitlerStr} has been shot.</span>;
        break;
      case LogType.DECK:
        const remainingPolicies = renderPolicies(entry.payload.remainingPolicies);
        logEntry =
          remainingPolicies.length === 1 ? (
            <span>The remaining policy in the draw pile is {remainingPolicies}</span>
          ) : (
            <span>The remaining policies in the draw pile are {remainingPolicies}</span>
          );
        break;
    }

    //.6989em = 1/.93 * .65em
    return (
      <ListItem key={i} sx={{ margin: "0", padding: "0", paddingLeft: "5px" }}>
        <Typography
          sx={{
            marginLeft: "0px",
            color: "#a7a7a8",
            fontFamily: "inter",
            fontWeight: 500,
            fontSize: ".93em",
          }}
        >
          {renderDate(entry.date, ".6989em")}
          {logEntry}
        </Typography>
      </ListItem>
    );
  });

  //minHeight: {xs: '180px', sm: `${boardDimensions.y}px`}, maxHeight: {xs: '290px', sm: `${boardDimensions.y}px`},  flex 1
  //paper minHeight: {xs: 'calc(175px - 30px)'}, maxHeight: {xs: `calc(80vh - ${boardDimensions.y}px - 30px - 30px)`, sm: `${boardDimensions.y}px`}, height: {xs: `calc(80vh - ${boardDimensions.y}px - 30px - 30px)`, sm: `${boardDimensions.y}px`}

  //flex 1 on Box at sm is so that it expands horizontally when side by side for flexDirection row
  //problems arise with overflow of content in Paper when it has flex 1 in xs and it's flexDirection col
  //height in xs is subtracting 30px for appbar, and 15px for marginTop, 5px is to` leave a margin bottom
  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flex: { sm: 1 },
          justifyContent: "center",
          // width: { xs: "100vw", sm: "50vw" },
          // border: "2px solid red",

          height: {
            xs: `calc(100vh - 30px - ${boardDimensions.y}px - ${playersDimensions.y}px )`,
            sm: `${boardDimensions.y}px`,
          },
          minHeight: { xs: "210px" },
          display: "flex",
          flexDirection: "column",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <StatusMessage
          game={game}
          hitlerFlippedForLibSpyGuess={hitlerFlippedForLibSpyGuess}
          pauseActions={pauseActions}
          policiesStatusMessage={policiesStatusMessage}
        />
        <Paper
          ref={paperRef}
          elevation={0}
          sx={{
            // width: "100%",
            border: "1px solid black",
            fontSize: {
              xs: `calc(100vw / 45)`,
              sm: `calc((100vw - ${boardDimensions.x}px) / 33)`,
              md: `min(calc((100vw - ${boardDimensions.x}px) / 34), 14px)`,
              lg: `min(calc((100vw - ${boardDimensions.x}px) / 34), 15px)`,
            }, //{ xs: "12px", sm: "14px", md: "16px" },
            marginBottom: { xs: "36px", sm: "36px", md: "40px" },
            flex: 1,
            borderRadius: "0",
            overflow: "auto",
            bgcolor: "#0a0a0a", //</Box>colors.hidden,
            paddingBottom: "4px",
            boxSizing: "border-box",
            scrollbarColor: "#525252 #a3a3a3",
            scrollbarWidth: { xs: "thin", sm: "thin", md: "auto" },
          }}
        >
          {log}
          <ListItem sx={{ height: "0", padding: "0", margin: "0", boxSizing: "border-box" }} ref={scrollRef}></ListItem>
        </Paper>

        <form style={{}}>
          {/* height: 0, position: "absolute", bottom: -1, boxSizing: "border-box" */}
          {/* <button
              style={{
                visibility: "hidden",
                width: "0px",
                height: "0px",
                position: "absolute",
                bottom: 0,
              }}
              type="submit"
              onClick={sendMessage}
            ></button> */}
          <Box
            sx={{
              position: "absolute",
              bottom: "10px",
              display: "flex",
              width: "100%",
              height: { xs: "32px", sm: "32px", md: "36px" },
              alignItems: "center",
            }}
          >
            <input
              className="chat-input"
              ref={messageInputRef}
              disabled={disabled}
              value={disabled ? "" : message}
              onBlur={() => window.dispatchEvent(new Event("resize"))}
              autoComplete="off"
              placeholder={
                !disabled
                  ? "Send a message"
                  : !thisPlayer.alive
                  ? "Dead cannnot speak"
                  : game.status === Status.LIB_SPY_GUESS
                  ? "Chat disabled during guess"
                  : "Chat disabled during government"
              }
              onChange={e => setMessage(e.target.value)}
              style={{
                width: "100%",
                flex: 1,
                height: "100%",
                borderRadius: "3px 3px 4px 4px",
                // paddingLeft: "12px",
                // margin: "0 0 0 1px",
                marginRight: "2px",
                marginLeft: "2px",
                marginTop: "15px",
                border: "none",
                fontFamily: "inter",
                fontSize: ".93em", //"15px",
                backgroundColor: "#0a0a0a",
                color: "#e5e5e5",
                boxSizing: "border-box",
                opacity: disabled ? 0.4 : 1,
              }}
            />
            <Button
              sx={{
                margin: "0 5px 0 6px",
                height: "100%",
                backgroundColor: disabled ? "#737373" : "#1d4ed8",
                outline: `2px solid ${disabled ? "#737373" : "#1d4ed8"}`,
                color: colors.hidden,
                padding: "0px",
                borderRadius: "4px",
                //comment out styles below to use the button
                visibility: "hidden",
                width: "0px",
                height: "0px",
                position: "absolute",
                bottom: 0,
              }}
              variant="contained"
              disabled={disabled}
              type="submit"
              onClick={e => {
                sendMessage(e);
                messageInputRef.current.focus();
              }}
            >
              Chat
            </Button>
          </Box>

          {/* <TextField
              inputRef={messageInputRef}
              disabled={disabled}
              value={disabled ? "" : message}
              onBlur={() => window.dispatchEvent(new Event("resize"))}
              size="small"
              autoComplete="off"
              placeholder={
                !disabled
                  ? "Send a message"
                  : !thisPlayer.alive
                  ? "Dead cannnot speak"
                  : game.status === Status.LIB_SPY_GUESS
                  ? "Chat disabled during guess"
                  : "Chat disabled during government"
              }
              sx={{
                //consider changing to custom textfield - see all styles in dev tools
                // "& .MuiOutlinedInput-root": {
                //   "&.Mui-focused fieldset": {
                //     borderColor: "red",
                //   },
                // },
                //not exactly right - need to also handle without focus and on hover
                // input: { color: "red" },
                width: "100%",
                borderRadius: "3px",
                bgcolor: "#e5e5e5",
                position: "absolute",
                bottom: 0,
              }}
              onChange={e => setMessage(e.target.value)}
            /> */}
        </form>
      </Box>
    </>
  );
}
