export const UPDATE = 'UPDATE'

export const ClaimType = {
  PRES: 'PRES',
  CHAN: 'CHAN',
  INV: 'INV',
  INSPECT_TOP3: 'INSPECT_TOP3'
}

export const Status = {
  CREATED: 'CREATED',
  STARTED: 'STARTED',
  CHOOSE_CHAN: 'CHOOSE_CHAN',
  PRES_CLAIM: 'PRES_CLAIM',
  CHAN_CLAIM: 'CHAN_CLAIM',
  END_LIB: 'END_LIB',
  END_FASC: 'END_FASC',
  INV_CLAIM: 'INV_CLAIM',
  VOTE: 'VOTE',
  PRES_DISCARD: 'PRES_DISCARD',
  CHAN_PLAY: 'CHAN_PLAY',
  INV: 'INV',
  SE: 'SE',
  INSPECT_TOP3: 'INSPECT_TOP3',
  GUN: 'GUN',
  VETO_REPLY: 'VETO_REPLY',
  VETO_DECLINED: 'VETO_DECLINED',
  LIB_SPY_GUESS: 'LIB_SPY_GUESS',
  SHOW_VOTE_RESULT: 'SHOW_VOTE_RESULT',
  SHOW_INV_CHOICE: 'SHOW_INV_CHOICE',
  SHOW_LIB_SPY_GUESS: 'SHOW_LIB_SPY_GUESS',
  SHOW_ENACT_LIB_POLICY: 'SHOW_ENACT_LIB_POLICY',
  SHOW_ENACT_FASC_POLICY: 'SHOW_ENACT_FASC_POLICY',
  SHOW_TRACKER_ADVANCE: 'SHOW_TRACKER_ADVANCE'
}


export const LogType = {
  INDIVIDUAL_SEAT: 'INDIVIDUAL_SEAT',
  HITLER_SEAT: 'HITLER_SEAT',
  OTHER_FASCIST_SEATS: 'OTHER_FASCIST_SEATS',
  CHOOSE_CHAN: 'CHOOSE_CHAN',
  ENACT_POLICY: 'ENACT_POLICY',
  CHAN_CLAIM: 'CHAN_CLAIM',
  PRES_CLAIM: 'PRES_CLAIM',
  INV: 'INV',
  INV_CLAIM: 'INV_CLAIM',
  SE: 'SE',
  INSPECT_TOP3: 'INSPECT_TOP3',
  INSPECT_TOP3_CLAIM: 'INSPECT_TOP3_CLAIM',
  GUN: 'GUN',
  VETO_REQUEST: 'VETO_REQUEST',
  VETO_REPLY: 'VETO_REPLY',
  CONFIRM_FASC: 'CONFIRM_FASC',
  DECK: 'DECK',
  LIB_SPY_GUESS: 'LIB_SPY_GUESS',
  SHUFFLE_DECK: 'SHUFFLE_DECK',
   //these don't require data
  ELECTION_FAIL: 'ELECTION_FAIL',
  TOP_DECK: 'TOP_DECK',
  LIB_WIN: 'LIB_WIN',
  FASC_WIN: 'FASC_WIN',
  LIB_SPY_WIN: 'LIB_SPY_WIN',
  LIB_SPY_FAIL: 'LIB_SPY_FAIL',
  HITLER_ELECTED: 'HITLER_ELECTED',
  HITLER_SHOT: 'HITLER_SHOT',
  INTRO_DECK: 'INTRO_DECK',
  INTRO_ROLES: 'INTRO_ROLES',
  INTRO_LIB_SPY: 'INTRO_LIB_SPY',
  INTRO_MIXED: 'INTRO_MIXED',
  INTRO_HITLER_KNOWS_FASC: 'INTRO_HITLER_KNOWS_FASC',
  INTRO_RED_DOWN: 'INTRO_RED_DOWN'
}

export const GameType = {
  BLIND: 'Blind',
  NORMAL: 'Normal',
  LIB_SPY: 'Liberal Spy',
  MIXED_ROLES: 'Mixed Roles'
}

export const DisplayType = {
  VOTES: 'VOTES',
  INV: 'INV',
  LIB_SPY_GUESS: 'LIB_SPY_GUESS',
  ENACT_LIB_POLICY: 'ENACT_LIB_POLICY',
  ENACT_FASC_POLICY: 'ENACT_FASC_POLICY'
}

export const GameSettings = {
  TYPE: 'type',
  REDDOWN: 'redDown',
  HITLERKNOWSFASC: 'hitlerKnowsFasc',
  SIMPLEBLIND: 'simpleBlind',
  TEAMLIBSPY: 'teamLibSpy'
}

export const Vote = {
  JA: 'Ja',
  NEIN: 'Nein'
}

export const Team = {
  LIB: 'Liberal',
  FASC: 'Fascist',
}

export const Role = {
  LIB: 'Liberal',
  FASC: 'Fascist',
  HITLER: 'Hitler',
  LIB_SPY: 'Liberal Spy'
}

export const Color = {
  RED: 'R',
  BLUE: 'B'
}

export const Policy = {
  LIB: 'Liberal',
  FASC: 'Fascist'
}

export const BBB = 'BBB'
export const RBB = 'RBB'
export const RRB = 'RRB'
export const RRR = 'RRR'
export const BB = 'BB'
export const RB = 'RB'
export const RR = 'RR'

export const draws3 = [RRR, RRB, RBB, BBB]
export const draws2 = [RR, RB, BB]

export const CHAN2 = {
  RR: 'RR',
  RB: 'RB',
  BB: 'BB',
}

export const PRES3 = {
  RRR: 'RRR',
  RRB: 'RRB',
  RBB: 'RBB',
  BBB: 'BBB'
}

export const inGov = (game, name) => (game.currentPres === name || game.currentChan === name) &&
(game.status === Status.PRES_DISCARD || game.status === Status.CHAN_PLAY || game.status === Status.VETO_DECLINED || game.status === Status.VETO_REPLY)

// export const presOrChanDuringClaiming = (game, name) => (game.currentPres === name || game.currentChan === name) && (game.status === Status.PRES_CLAIM || game.status === Status.CHAN_CLAIM)
export const claiming = (game, name) => (game.currentPres === name && game.status === Status.PRES_CLAIM) || (game.currentChan === name && game.status === Status.CHAN_CLAIM)

export const choosableAnimation = (width) =>`
@keyframes choosable {
  0% {
    box-shadow: 0 0 0 ${width}px orange;
  }
  40% {
    box-shadow: 0 0 0 ${width}px orange;
  }
  80% {
    box-shadow: 0 0 0 ${width}px rgb(46, 109, 28);
  }
  100% {
    box-shadow: 0 0 0 ${width}px orange;
  }

}
`
export const upAnimation = (playerHeight) =>`
@keyframes up {
  0% {
    bottom: ${-playerHeight}px;
  }
  100% {
    bottom: 0px;
  }
}
`


export const flipAndDownAnimation = (playerHeight) => `
  @keyframes flipAndDown {
    0% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
    30% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
    70% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
    100% {
      bottom: ${-playerHeight}px;
      transform: rotateY(180deg);
    }
  }
  `

export const upAndDownAnimation = (playerHeight) => `
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
`
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
`
export const flipAndUnflipAnimation = () => `
  @keyframes flipAndUnflip {
    0% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
    20% {
      bottom: 0px;
      transform: rotateY(180deg);
    }
    80% {
        bottom: 0px;
        transform: rotateY(180deg);
      }
    100% {
      bottom: 0px;
      transform: rotateY(0deg);
    }
  }
`
export const stillAnimation = () => `
  @keyframes still {
    0% {
      bottom: 0px;
    }
    100% {
      bottom: 0px;
    }
  }
`




export const enactPolicyAnimation = (policyWidth, policyBorderRadius, left, bottom, policyGap, policyNum) => {
 return `
  @keyframes enact {
    0% {
      width: ${policyWidth*1.4}px;
      left: ${-policyWidth*1.4}px;
      bottom: 50%;
      border-radius: ${1.4*policyBorderRadius}px;
      transform: translate(0%, 50%) rotateY(0deg);
    }
    20% {
      width: ${policyWidth*1.4}px;
      left: ${policyWidth/2}px;
      bottom: 50%;
      border-radius: ${1.4*policyBorderRadius}px;
      transform: translate(0%, 50%) rotateY(0deg);
    }
    40% {
      width: ${policyWidth*1.4}px;
      left: ${policyWidth/2}px;
      bottom: 50%;
      border-radius: ${1.4*policyBorderRadius}px;
      transform: translate(0%, 50%) rotateY(180deg);
    }
    70% {
      width: ${policyWidth*1.4}px;
      left: ${left + (policyNum - 1)*(policyWidth + policyGap)}px;
      bottom: ${bottom}px;
      border-radius: ${1.4*policyBorderRadius}px;
      transform: rotateY(180deg);
    }
    100% {
      width: ${policyWidth}px;
      left: ${left + (policyNum - 1)*(policyWidth + policyGap)}px;
      bottom: ${bottom}px;
      border-radius: ${policyBorderRadius}px;
      transform: rotateY(180deg);
    }


  }
  `;
}

/**
 *
 *
 *
 */