import * as React from "react";
import { Box, Dialog, DialogActions, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import hitlerPng from "../img/Hitler.png";
import liberalPng from "../img/Liberal.png";
import liberalSpyPng from "../img/LiberalSpy.png";
import fascistPng from "../img/Fascist.png";
import roleBackPng from "../img/RoleBack.png";
import libParty from "../img/LibParty.png";
import fascParty from "../img/FascParty.png";
import hiddenRoleBackPng from "../img/HiddenRoleBack.png";
import { Role, GameType, Team, Status, colors, CONFIRM_FASC_DIALOG_DURATION } from "../consts";
import { inGov, claiming, gameOver, isBlindSetting } from "../helperFunctions";
import Fade from "@mui/material/Fade";

export default function RoleDialog({ thisPlayer, game, roleOpen, setRoleOpen, setConfirmFascOpen }) {
  let roleImg,
    teamImg,
    showRoleImg = true;
  switch (thisPlayer?.role) {
    case Role.FASC:
      roleImg = fascistPng;
      break;
    case Role.LIB:
      roleImg = liberalPng;
      break;
    case Role.HITLER:
      roleImg = hitlerPng;
      break;
    case Role.LIB_SPY:
      roleImg = liberalSpyPng;
      break;
    default:
      roleImg = roleBackPng;
  }
  if (isBlindSetting(game.settings.type) && !thisPlayer.confirmedFasc && !gameOver(game.status)) {
    showRoleImg = false;
  }

  switch (thisPlayer?.team) {
    case Team.LIB:
      teamImg = libParty;
      break;
    case Team.FASC:
      teamImg = fascParty;
      break;
  }

  const disableConfirmFasc =
    inGov(game, thisPlayer.name) || (game.currentPres === thisPlayer.name && game.status === Status.CHAN_CLAIM) || claiming(game, thisPlayer.name);
  const confirmFascText = disableConfirmFasc ? "Cannot confirm fascist until after claims" : "confirm fascist";

  //for the player who incorrectly confirmed fasc, close their role automatically
  React.useEffect(() => {
    if (gameOver(game.status)) {
      setTimeout(() => {
        setRoleOpen(false);
      }, 2000); //transition duration is 1.5 and after 3 is when animation takes place
    }
  }, [game.status]);

  return (
    <Dialog
      open={roleOpen}
      // TransitionComponent={Fade}
      // transitionDuration={500}
      onClose={() => setRoleOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#a3a3a3" }}>
        {game.settings.type === GameType.MIXED_ROLES && (
          <Box sx={{ width: { xs: 140, sm: 200 }, maxWidth: { xs: `calc(100vh/3)` }, marginRight: { xs: 2, sm: 4 } }}>
            <img src={teamImg} draggable="false" style={{ width: "100%" }} />
          </Box>
        )}
        <Box sx={{ width: { xs: 140, sm: 200 }, maxWidth: { xs: `calc(100vh/3)` }, position: "relative" }}>
          <img
            src={isBlindSetting(game.settings.type) ? hiddenRoleBackPng : roleImg}
            draggable="false"
            style={{ width: "100%", visibility: "hidden" }}
          />{" "}
          {/* just a placeholder to for the sizing */}
          <img
            src={roleImg}
            draggable="false"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              opacity: showRoleImg ? 1 : 0,
              transition: `opacity ${CONFIRM_FASC_DIALOG_DURATION}s cubic-bezier(.96,.01,.54,.72)`, //cubic-bezier(.84,-0.03,.58,.88)",
            }}
          />
          <img
            src={hiddenRoleBackPng}
            draggable="false"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: showRoleImg ? 0 : 1 }}
          />
        </Box>
      </DialogContent>
      {game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver(game.status) && (
        <DialogActions sx={{ display: "flex", justifyContent: "center", bgcolor: "#a3a3a3" }}>
          <Button
            disabled={disableConfirmFasc}
            onClick={() => setConfirmFascOpen(true)}
            variant="contained"
            sx={{
              "&:hover": { backgroundColor: colors.fascBackground },
              backgroundColor: colors.fasc,
              maxWidth: `100%`,
              fontSize: `min(calc(100vh / 30), 14px)`,
            }}
          >
            {confirmFascText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
