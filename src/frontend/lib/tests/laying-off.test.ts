import { calculateLayingOff } from '../cards-play/logics/laying-off';
import { CARDS } from '../data/cards.data';

const getCard = (name: string) => {
  const card = CARDS.find(c => c.name === name);
  if (!card) throw new Error(`Card not found: ${name}`);
  return card;
};

test('opponent ↋ should be laid off onto knocker set of ↋ ↋ ↋', () => {
  const knockerMelds = [
    getCard('hearts-0B'),
    getCard('spades-0B'),
    getCard('diamonds-0B'),
  ];

  const opponentCards = [
    getCard('clubs-0B'),        // ✅lay off
    getCard('hearts-03'),       // point: 3
    getCard('diamonds-05'),     // point: 5
  ];

  const result = calculateLayingOff(opponentCards, knockerMelds);

  expect(result.adjustedDeadwoodPoint).toBe(8); // 3 + 5
  expect(result.updatedDeadwoods.map(c => c.name)).toEqual([
    'hearts-03',
    'diamonds-05',
  ]);
});
