import calculateGinRummyScore from '../cards-play/logics/calc-score';
import { CARDS } from '../data/cards.data';

const getCard = (name: string) => {
  const card = CARDS.find(c => c.name === name);
  if (!card) throw new Error(`Card not found: ${name}`);
  return card;
};

test('should not recognize invalid run when a card is missing', () => {
  // 少了 hearts-0B
  const cards = [
    'hearts-08',
    'hearts-09',
    'hearts-0A',
    'hearts-10',
    'hearts-J'
  ].map(getCard);

  const result = calculateGinRummyScore(cards);

  const runNames = result.Runs.map(c => c.name);

  // 不应包含 hearts-0↋（因为根本没有）
  expect(runNames).not.toContain('hearts-0↋');

  // 应该识别到最合理的 run（例如 08 09 0↊）
  expect(runNames).toEqual(expect.arrayContaining([
    'hearts-08', 'hearts-09', 'hearts-0A'
  ]));

  // 总 deadwood 应该 > 0，因为不是完整 run
  expect(result.Deadwoods!.length).toBeGreaterThan(0);

});
