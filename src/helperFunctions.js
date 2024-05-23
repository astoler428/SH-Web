import {
  Status,
  Policy,
  draws3,
  draws2,
  POLICY_PILES_DELAY_BETWEEN_POLICIES,
  POLICY_PILES_DURATION,
  POLICY_PILES_INITIAL_DELAY,
  TOP_DECK_DELAY,
  ENACT_POLICY_DURATION,
  GAMEOVER_NOT_FROM_POLICY_DELAY,
} from "./consts";

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

export const policyPilesAnimationLength = move => {
  return POLICY_PILES_INITIAL_DELAY + POLICY_PILES_DURATION + POLICY_PILES_DELAY_BETWEEN_POLICIES * (move - 1);
};

export const policyEnactDelay = game => {
  if (game.vetoAccepted) {
    //must be a top deck for policy to enact on vetoAccepted
    return (
      TOP_DECK_DELAY +
      policyPilesAnimationLength(2) +
      (game.deck.reshuffleIsBeforeATopDeck ? policyPilesAnimationLength(game.deck.drawPile.length + 1) : 0)
    );
  } else {
    return game.topDecked ? TOP_DECK_DELAY : 0;
  }
};

export const showGameOverDelay = (game, hitlerFlippedForLibSpyGuess) => {
  if (game.alreadyEnded) {
    return 0;
  }
  return gameEndedWithPolicyEnactment(game, hitlerFlippedForLibSpyGuess)
    ? policyEnactDelay(game) + ENACT_POLICY_DURATION
    : GAMEOVER_NOT_FROM_POLICY_DELAY;
};

export const throttle = (fn, delay = 1000) => {
  let lastTime = 0;
  return (...args) => {
    const now = new Date().getTime();
    console.log(lastTime, now);
    if (now - lastTime < delay) {
      return;
    }
    lastTime = now;
    console.log(lastTime);
    fn(...args);
  };
};
