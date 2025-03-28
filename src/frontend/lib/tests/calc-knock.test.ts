import { calculateRoundScore } from '../cards-play/logics/calc-knock';
import { CARDS } from '../data/cards.data';
import type { PlayerSummary, ScoreSummary } from '../models/card-animation.model';

const getCard = (name: string) => {
  const card = CARDS.find(c => c.name === name);
  if (!card) throw new Error(`Card not found: ${name}`);
  return card;
};

describe('calculateRoundScore', () => {
  it('should detect Big Gin and assign 45 bonus points', () => {
    const bigGinHand = [
      'spades-03','spades-04', 'spades-05', 'spades-06', 
      'diamonds-J', 'clubs-J','spades-J',
      'hearts-C', 'clubs-C','spades-C',
      'hearts-Q', 'clubs-Q','spades-Q',

    ].map(getCard);

    const player2Cards: PlayerSummary = {
      cards: bigGinHand,
      Melds: bigGinHand,
      MeldsPoint: bigGinHand.reduce((sum, c) => sum + c.point, 0),
      Deadwoods: [],
      DeadwoodsPoint: 0,
      DeadwoodsDozenalPoint: '0',
      Sets: [],
      Runs: bigGinHand
    };

    const opponentDeadwood = [getCard('spades-05'), getCard('diamonds-06')];

    const player1Cards: PlayerSummary = {
      cards: opponentDeadwood,
      Melds: [],
      MeldsPoint: 0,
      Deadwoods: opponentDeadwood,
      DeadwoodsPoint: opponentDeadwood.reduce((sum, c) => c.point + sum, 0),
      DeadwoodsDozenalPoint: '0',
      Sets: [],
      Runs: []
    };

    const scoreSummary: ScoreSummary | null = null;

    const result = calculateRoundScore({
      host: '1',
      player1Cards,
      player2Cards,
      scoreSummary
    });

    expect(result.isBigGin).toBe(true);
    expect(result.result).toBe('Big Gin');
    expect(result.newScoreSummary.rounds[0].p2Bonus).toBe(45);
    expect(result.newScoreSummary.rounds[0].p2Score).toBe(11); // 5 + 6 deadwood from opponent
    expect(result.newScoreSummary.rounds[0].p2Total).toBe(56);
  });
});