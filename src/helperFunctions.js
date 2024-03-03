import { Status, Policy, draws3, draws2 } from "./consts";

export const inGov = (game, name) =>
  (game.currentPres === name || game.currentChan === name) &&
  (game.status === Status.PRES_DISCARD ||
    game.status === Status.CHAN_PLAY ||
    game.status === Status.VETO_DECLINED ||
    game.status === Status.VETO_REPLY);

// export const presOrChanDuringClaiming = (game, name) => (game.currentPres === name || game.currentChan === name) && (game.status === Status.PRES_CLAIM || game.status === Status.CHAN_CLAIM)
export const claiming = (game, name) =>
  (game.currentPres === name && game.status === Status.PRES_CLAIM) || (game.currentChan === name && game.status === Status.CHAN_CLAIM);

export const gameOver = status => status === Status.END_FASC || status === Status.END_LIB;

export const gameEndedWithPolicyEnactment = (game, hitlerFlippedForLibSpyGuess) =>
  (game.LibPoliciesEnacted === 5 && !hitlerFlippedForLibSpyGuess) || game.FascPoliciesEnacted === 6;

export const isBlindSetting = gameType => gameType?.slice(-5) === "Blind";

export const determine3Cards = cards3 => {
  const blues = cards3.reduce((acc, card) => (card.policy === Policy.LIB ? acc + 1 : acc), 0);
  return draws3[blues];
};

export const determine2Cards = cards2 => {
  const blues = cards2.reduce((acc, card) => (card.policy === Policy.LIB ? acc + 1 : acc), 0);
  return draws2[blues];
};
