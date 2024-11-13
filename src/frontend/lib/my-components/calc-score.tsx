import { Card } from '../data/cards.data';

type CalcScoreCard = {
    order: number,
    point: number;
    name: string;
    image: string;
  };
  
 export interface PlayerSummary{
    cards: Card[]
    Melds?: Card[]
    MeldsPoint?: number
    Deadwoods?: Card[]
    DeadwoodsPoint?: number
    Sets?:Card[]
    Runs?:Card[]
  }
  
  const calculateGinRummyScore = (CalcScoreCards: CalcScoreCard[]): PlayerSummary & { Sets: CalcScoreCard[]; Runs: CalcScoreCard[] } => {
    const suits: { [key: string]: CalcScoreCard[] } = {};
    const ranks: { [key: string]: CalcScoreCard[] } = {};
  
    CalcScoreCards.forEach((CalcScoreCard) => {
      const [suit, rank] = CalcScoreCard.name.split('-');
      if (!suits[suit]) suits[suit] = [];
      suits[suit].push(CalcScoreCard);
  
      if (!ranks[rank]) ranks[rank] = [];
      ranks[rank].push(CalcScoreCard);
    });
  
    // 计算所有可能的同花顺 (run) 和相同牌面组合 (set)
    const calculateMelds = () => {
      const runGroups: { melds: CalcScoreCard[]; meldsPoint: number }[] = [];
      const setGroups: { melds: CalcScoreCard[]; meldsPoint: number }[] = [];
  
      // 计算同花顺
      for (const suit in suits) {
        const suitCards = suits[suit];
        if (suitCards.length >= 3) {
          const sortedSuitCards = suitCards.sort((a, b) => a.order - b.order);
          for (let i = 0; i < sortedSuitCards.length; i++) {
            const currentRun: CalcScoreCard[] = [sortedSuitCards[i]];
            for (let j = i + 1; j < sortedSuitCards.length; j++) {
              if (sortedSuitCards[j].order === currentRun[currentRun.length - 1].order + 1) {
                currentRun.push(sortedSuitCards[j]);
                if (currentRun.length >= 3) {
                  runGroups.push({
                    melds: [...currentRun],
                    meldsPoint: currentRun.reduce((sum, card) => sum + card.point, 0),
                  });
                }
              } else {
                break;
              }
            }
          }
        }
      }
  
      // 计算相同牌面组合 (set)
      for (const rank in ranks) {
        const rankCards = ranks[rank];
        if (rankCards.length >= 3) {
          const combinations = (array: CalcScoreCard[], size: number): CalcScoreCard[][] => {
            if (size > array.length) return [];
            if (size === array.length) return [array];
            if (size === 1) return array.map((el) => [el]);
            const result: CalcScoreCard[][] = [];
            array.forEach((el, index) => {
              const smallerCombinations = combinations(array.slice(index + 1), size - 1);
              smallerCombinations.forEach((comb) => {
                result.push([el, ...comb]);
              });
            });
            return result;
          };
          for (let size = 3; size <= rankCards.length; size++) {
            const sets = combinations(rankCards, size);
            sets.forEach((set) => {
              setGroups.push({
                melds: set,
                meldsPoint: set.reduce((sum, card) => sum + card.point, 0),
              });
            });
          }
        }
      }
  
      return { runGroups, setGroups };
    };
  
    const { runGroups, setGroups } = calculateMelds();
    const usedCards: Set<CalcScoreCard> = new Set();
    const bestRuns: CalcScoreCard[] = [];
    const bestSets: CalcScoreCard[] = [];
  
    runGroups.sort((a, b) => b.meldsPoint - a.meldsPoint || b.melds.length - a.melds.length);
    setGroups.sort((a, b) => b.meldsPoint - a.meldsPoint || b.melds.length - a.melds.length);
  
    // 选择最佳的 Runs
    runGroups.forEach((runGroup) => {
      const canUseRun = runGroup.melds.every((card) => !usedCards.has(card));
      if (canUseRun) {
        bestRuns.push(...runGroup.melds);
        runGroup.melds.forEach((card) => usedCards.add(card));
      }
    });
  
    // 选择最佳的 Sets
    setGroups.forEach((setGroup) => {
      const canUseSet = setGroup.melds.every((card) => !usedCards.has(card));
      if (canUseSet) {
        bestSets.push(...setGroup.melds);
        setGroup.melds.forEach((card) => usedCards.add(card));
      }
    });
  
    const bestMeldsPoint = [...bestRuns, ...bestSets].reduce((sum, card) => sum + card.point, 0);
    const deadwoods = CalcScoreCards.filter((CalcScoreCard) => !usedCards.has(CalcScoreCard));
    const deadwoodsPoint = deadwoods.reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
  
    return {
      cards: CalcScoreCards,
      Melds: [...bestRuns, ...bestSets],
      MeldsPoint: bestMeldsPoint,
      Deadwoods: deadwoods,
      DeadwoodsPoint: deadwoodsPoint,
      Sets: bestSets,
      Runs: bestRuns,
    };
  };
  
  export default calculateGinRummyScore;
