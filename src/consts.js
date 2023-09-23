export const CREATE_GAME = 'CREATE_GAME'
export const JOIN_GAME = 'JOIN_GAME'
export const LEAVE_GAME = 'LEAVE_GAME'
export const UPDATE_PLAYERS = 'UPDATE_PLAYERS'
export const START_GAME = 'START_GAME'
export const UPDATE_LOBBY = 'UPDATE_LOBBY'
export const UPDATE = 'UPDATE'

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
  HITLER: 'Hitler'
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