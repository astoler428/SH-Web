export const POLICY_WIDTH = 74

export const CREATE_GAME = 'CREATE_GAME'
export const JOIN_GAME = 'JOIN_GAME'
export const LEAVE_GAME = 'LEAVE_GAME'
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS'
export const START_GAME = 'START_GAME'
export const UPDATE_LOBBY = 'UPDATE_LOBBY'
export const UPDATE = 'UPDATE'

export const ClaimType = {
  PRES: 'PRES',
  CHAN: 'CHAN',
  INV: 'INV',
  INSPECT_TOP3: 'INSPECT_TOP3'
}

export const Status = {
  CREATED: 'CREATED',
  CHOOSE_CHAN: 'CHOOSE_CHAN',
  PRES_CLAIM: 'PRES_CLAIM',
  CHAN_CLAIM: 'CHAN_CLAIM',
  END_LIB: 'END_LIB',
  END_FASC: 'END_FASC',
  INV_CLAIM: 'INV_CLAIM',
  VOTE: 'VOTE',
  VOTE_RESULT: 'VOTE_RESULT',
  PRES_DISCARD: 'PRES_DISCARD',
  CHAN_PLAY: 'CHAN_PLAY',
  INV: 'INV',
  SE: 'SE',
  INSPECT_TOP3: 'INSPECT_TOP3',
  GUN: 'GUN',
  VETO_REPLY: 'VETO_REPLY',
  VETO_DECLINED: 'VETO_DECLINED',
}


export const LogType = {
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
(game.status === Status.PRES_DISCARD || game.status === Status.CHAN_PLAY || game.status === Status.CHAN_CLAIM || game.status === Status.PRES_CLAIM || game.status === Status.VETO_DECLINED || game.status === Status.VETO_REPLY)
