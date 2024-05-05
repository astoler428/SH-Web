export const colors = {
  fasc: "#E34D0D",
  hitler: "#A72323",
  lib: "#0EA5E9",
  libDark: "#1E6DA7",
  hidden: "#f5f5f5",
  default: "orange",
  gold: "gold",
  fascBackground: "#E66026", //'#C73F04',
  libBackground: "#0699DB",
  darkLibBackground: "#446E8D",
  //logChat has some blacks or off black to add too
  //backgroudn for claims
};

export const UPDATE = "UPDATE";

export const ClaimType = {
  PRES: "PRES",
  CHAN: "CHAN",
  INV: "INV",
  INSPECT_TOP3: "INSPECT_TOP3",
};

export const Status = {
  CREATED: "CREATED",
  STARTED: "STARTED",
  CHOOSE_CHAN: "CHOOSE_CHAN",
  PRES_CLAIM: "PRES_CLAIM",
  CHAN_CLAIM: "CHAN_CLAIM",
  END_LIB: "END_LIB",
  END_FASC: "END_FASC",
  INV_CLAIM: "INV_CLAIM",
  VOTE: "VOTE",
  PRES_DISCARD: "PRES_DISCARD",
  CHAN_PLAY: "CHAN_PLAY",
  INV: "INV",
  SE: "SE",
  INSPECT_TOP3: "INSPECT_TOP3",
  GUN: "GUN",
  VETO_REPLY: "VETO_REPLY",
  VETO_DECLINED: "VETO_DECLINED",
  LIB_SPY_GUESS: "LIB_SPY_GUESS",
  SHOW_VOTE_RESULT: "SHOW_VOTE_RESULT",
  SHOW_LIB_SPY_GUESS: "SHOW_LIB_SPY_GUESS",
  RESET_GAME: "RESET_GAME",
};

export const LogType = {
  INDIVIDUAL_SEAT: "INDIVIDUAL_SEAT",
  HITLER_SEAT: "HITLER_SEAT",
  OTHER_FASCIST_SEATS: "OTHER_FASCIST_SEATS",
  CHOOSE_CHAN: "CHOOSE_CHAN",
  ENACT_POLICY: "ENACT_POLICY",
  CHAN_CLAIM: "CHAN_CLAIM",
  PRES_CLAIM: "PRES_CLAIM",
  INV: "INV",
  INV_CLAIM: "INV_CLAIM",
  SE: "SE",
  INSPECT_TOP3: "INSPECT_TOP3",
  INSPECT_TOP3_CLAIM: "INSPECT_TOP3_CLAIM",
  GUN: "GUN",
  VETO_REQUEST: "VETO_REQUEST",
  VETO_REPLY: "VETO_REPLY",
  CONFIRM_FASC: "CONFIRM_FASC",
  DECK: "DECK",
  LIB_SPY_GUESS: "LIB_SPY_GUESS",
  SHUFFLE_DECK: "SHUFFLE_DECK",
  //these don't require data
  ELECTION_FAIL: "ELECTION_FAIL",
  TOP_DECK: "TOP_DECK",
  LIB_WIN: "LIB_WIN",
  FASC_WIN: "FASC_WIN",
  LIB_SPY_WIN: "LIB_SPY_WIN",
  LIB_SPY_FAIL: "LIB_SPY_FAIL",
  HITLER_ELECTED: "HITLER_ELECTED",
  HITLER_SHOT: "HITLER_SHOT",
  INTRO_DECK: "INTRO_DECK",
  INTRO_ROLES: "INTRO_ROLES",
  INTRO_LIB_SPY: "INTRO_LIB_SPY",
  INTRO_MIXED: "INTRO_MIXED",
  INTRO_HITLER_KNOWS_FASC: "INTRO_HITLER_KNOWS_FASC",
  INTRO_RED_DOWN: "INTRO_RED_DOWN",
  HITLER_TO_GUESS_LIB_SPY: "HITLER_TO_GUESS_LIB_SPY",
  COOPERATIVE_BLIND: "COOPERATIVE_BLIND",
};

export const GameType = {
  BLIND: "Blind",
  COOPERATIVE_BLIND: "Cooperative Blind",
  TOTALLY_BLIND: "Totally Blind",
  NORMAL: "Normal",
  LIB_SPY: "Liberal Spy",
  MIXED_ROLES: "Mixed Roles",
};

export const DisplayType = {
  VOTES: "VOTES",
  INV: "INV",
  LIB_SPY_GUESS: "LIB_SPY_GUESS",
  ENACT_LIB_POLICY: "ENACT_LIB_POLICY",
  ENACT_FASC_POLICY: "ENACT_FASC_POLICY",
};

export const GameSettings = {
  TYPE: "type",
  REDDOWN: "redDown",
  HITLERKNOWSFASC: "hitlerKnowsFasc",
  SIMPLEBLIND: "simpleBlind",
  COOPERATIVEBLIND: "cooperativeBlind",
  TEAMLIBSPY: "teamLibSpy",
};

export const Vote = {
  JA: "Ja",
  NEIN: "Nein",
};

export const Team = {
  LIB: "liberal",
  FASC: "fascist",
};

export const Role = {
  LIB: "liberal",
  FASC: "fascist",
  HITLER: "Hitler",
  LIB_SPY: "liberal spy",
};

export const Identity = {
  LIB: "liberal",
  FASC: "fascist",
  HITLER: "Hitler",
};

export const Color = {
  RED: "R",
  BLUE: "B",
};

export const Policy = {
  LIB: "liberal",
  FASC: "fascist",
};

export const BBB = "BBB";
export const RBB = "RBB";
export const RRB = "RRB";
export const RRR = "RRR";
export const BB = "BB";
export const RB = "RB";
export const RR = "RR";

export const draws3 = [RRR, RRB, RBB, BBB];
export const draws2 = [RR, RB, BB];

export const CHAN2 = {
  RR: "RR",
  RB: "RB",
  BB: "BB",
};

export const PRES3 = {
  RRR: "RRR",
  RRB: "RRB",
  RBB: "RBB",
  BBB: "BBB",
};

export const TOP_DECK_DELAY = 1.5;
export const RESHUFFLE_DELAY = 4;
export const ENACT_POLICY_DURATION = 6;
export const GAMEOVER_NOT_FROM_POLICY_DELAY = 3;
export const CONFIRM_FASC_DIALOG_DURATION = 1.5;
export const INV_DURATION = 3;
export const VOTE_DELAY = 0.2;
export const VOTE_DURATION = 1;
export const HITLER_FLIP_FOR_LIB_SPY_GUESS_DURATION = 1.5;

export const choosableAnimation = width => `
@keyframes choosable {
  0% {
    box-shadow: 0 0 0 ${width}px orange;
  }
  40% {
    box-shadow: 0 0 0 ${width}px orange;
  }
  80% {
    box-shadow: 0 0 0 ${width}px #404040;
  }
  100% {
    box-shadow: 0 0 0 ${width}px orange;
  }
}
`;
export const policyPileDownAnimation = top => `
@keyframes policyPileDown {
  0% {
    top: 0;
    animation-timing-function: cubic-bezier(.36,.7,.51,.94);
  }
  100% {
    top: ${top}px;
  }
}
`;
export const policyPileUpAnimation = top => `
@keyframes policyPileUp {
  0% {
    top: ${top};
    animation-timing-function: cubic-bezier(.36,.7,.51,.94);
  }
  100% {
    top: 0px;
  }
}
`;

export const upAnimation = playerHeight => `
@keyframes up {
  0% {
    bottom: ${-playerHeight}px;
  }
  100% {
    bottom: 0px;
  }
}
`;

export const flipAndDownAnimation = (playerHeight, oneSecPercentage) => `
  @keyframes flipAndDown {
    0% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
    ${oneSecPercentage}% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
    ${2 * oneSecPercentage}% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
    ${100 - oneSecPercentage}% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
    100% {
      bottom: ${-playerHeight}px;
      transform: rotateY(180deg);
    }
  }
  `;

export const upAndDownAnimation = playerHeight => `
  @keyframes upAndDown {
    0% {
      bottom: ${-playerHeight}px;
    }
    33% {
      bottom: 0px;
    }
    66% {
      bottom: 0px;
    }
    100% {
      bottom: ${-playerHeight}px;
    }
  }
`;
export const flipAnimation = () => `
  @keyframes flip {
    0% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
    100% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
  }
`;
export const flipAndUnflipAnimation = percentage => `
  @keyframes flipAndUnflip {
    0% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
    ${percentage}% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
    ${100 - percentage}% {
        bottom: 0px;
        transform: rotateY(180deg);
      }
    100% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
  }
`;
export const stillAnimation = () => `
  @keyframes still {
    0% {
      bottom: 0px;
    }
    100% {
      bottom: 0px;
    }
  }
`;

export const enactPolicyAnimation = (policyWidth, left, bottom, policyGap, policyNum) => {
  return `
  @keyframes enact {
    0% {
      width: ${policyWidth * 1.25}px;
      left: ${-policyWidth * 1.25}px;
      bottom: 50%;
      transform: translate(0%, 50%) rotateY(0deg);
    }
    20% {
      width: ${policyWidth * 1.25}px;
      left: ${policyWidth / 2}px;
      bottom: 50%;
      transform: translate(0%, 50%) rotateY(0deg);
    }
    40% {
      width: ${policyWidth * 1.25}px;
      left: ${policyWidth / 2}px;
      bottom: 50%;
      transform: translate(0%, 50%) rotateY(180deg);
    }
    70% {
      width: ${policyWidth * 1.25}px;
      left: ${left + (policyNum - 1) * (policyWidth + policyGap)}px;
      bottom: ${bottom}px;
      transform: rotateY(180deg);
    }
    100% {
      width: ${policyWidth}px;
      left: ${left + (policyNum - 1) * (policyWidth + policyGap)}px;
      bottom: ${bottom}px;
      transform: rotateY(180deg);
    }
  }
  `;
};

/**
 *
 *
 *
 */
