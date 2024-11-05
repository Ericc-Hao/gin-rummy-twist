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
  }
  
  const calculateGinRummyScore = (CalcScoreCards: CalcScoreCard[]): PlayerSummary => {
    // 把牌按照花色和牌面进行分类
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
    const calculateMelds = (): { melds: CalcScoreCard[]; meldsPoint: number }[] => {
      const meldGroups: { melds: CalcScoreCard[]; meldsPoint: number }[] = [];
  
      // 计算同花顺
      for (const suit in suits) {
        const suitCards = suits[suit];
        if (suitCards.length >= 3) {
          // 对牌进行排序以检查是否为连续顺序
          const sortedSuitCards = suitCards.sort((a, b) => a.order - b.order);
          for (let i = 0; i < sortedSuitCards.length; i++) {
            const currentRun: CalcScoreCard[] = [sortedSuitCards[i]];
            for (let j = i + 1; j < sortedSuitCards.length; j++) {
              if (sortedSuitCards[j].order === currentRun[currentRun.length - 1].order + 1) {
                currentRun.push(sortedSuitCards[j]);
                if (currentRun.length >= 3) {
                  meldGroups.push({
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
          // 生成所有可能的相同牌面组合
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
              meldGroups.push({
                melds: set,
                meldsPoint: set.reduce((sum, card) => sum + card.point, 0),
              });
            });
          }
        }
      }
  
      return meldGroups;
    };
  
    // 获取 Melds 和其对应的总分
    const meldGroups = calculateMelds();
    const usedCards: Set<CalcScoreCard> = new Set();
    const bestMeldGroups: { melds: CalcScoreCard[]; meldsPoint: number }[] = [];
  
    meldGroups.sort((a, b) => b.meldsPoint - a.meldsPoint || b.melds.length - a.melds.length); // 按照得分从高到低排序，如果得分相同则按长度排序

    meldGroups.forEach((meldGroup) => {
      const canUseMeld = meldGroup.melds.every((card) => !usedCards.has(card));
      if (canUseMeld) {
        bestMeldGroups.push(meldGroup);
        meldGroup.melds.forEach((card) => usedCards.add(card));
      }
    });
  
    // 计算所有选中的 Melds 的总分
    const bestMelds = bestMeldGroups.flatMap(group => group.melds);
    const bestMeldsPoint = bestMeldGroups.reduce((sum, group) => sum + group.meldsPoint, 0);
  
    // 计算 Deadwoods 和 DeadwoodsPoint
    const deadwoods = CalcScoreCards.filter((CalcScoreCard) => !usedCards.has(CalcScoreCard));
    const deadwoodsPoint = deadwoods.reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
  
    // 返回结果
    return {
      cards: CalcScoreCards,
      Melds: bestMelds,
      MeldsPoint: bestMeldsPoint,
      Deadwoods: deadwoods,
      DeadwoodsPoint: deadwoodsPoint,
    };
  };
  
  export default calculateGinRummyScore;
