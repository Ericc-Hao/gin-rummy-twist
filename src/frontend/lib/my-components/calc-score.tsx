import { Card } from '../data/cards.data';

type CalcScoreCard = {
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
  
    // 计算同花顺 (run) 和相同牌面组合 (set)
    const calculateMelds = (): { melds: CalcScoreCard[]; meldsPoint: number } => {
      let melds: CalcScoreCard[] = [];
      let meldsPoint = 0;
  
      // 计算同花顺
      for (const suit in suits) {
        const sortedCalcScoreCards = suits[suit].sort((a, b) => a.point - b.point);
        let currentRun: CalcScoreCard[] = [];
  
        for (let i = 0; i < sortedCalcScoreCards.length; i++) {
          if (
            currentRun.length === 0 ||
            sortedCalcScoreCards[i].point === currentRun[currentRun.length - 1].point + 1
          ) {
            currentRun.push(sortedCalcScoreCards[i]);
          } else {
            if (currentRun.length >= 3) {
              melds = melds.concat(currentRun);
              meldsPoint += currentRun.reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
            }
            currentRun = [sortedCalcScoreCards[i]];
          }
        }
        if (currentRun.length >= 3) {
          melds = melds.concat(currentRun);
          meldsPoint += currentRun.reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
        }
      }
  
      // 计算相同牌面组合 (set)
      for (const rank in ranks) {
        if (ranks[rank].length >= 3) {
          melds = melds.concat(ranks[rank]);
          meldsPoint += ranks[rank].reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
        }
      }
  
      return { melds, meldsPoint };
    };
  
    // 获取 Melds 和其对应的总分
    const { melds, meldsPoint } = calculateMelds();
  
    // 计算 Deadwoods 和 DeadwoodsPoint
    const deadwoods = CalcScoreCards.filter((CalcScoreCard) => !melds.includes(CalcScoreCard));
    const deadwoodsPoint = deadwoods.reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
  
    // 返回结果
    return {
      cards: CalcScoreCards,
      Melds: melds,
      MeldsPoint: meldsPoint,
      Deadwoods: deadwoods,
      DeadwoodsPoint: deadwoodsPoint,
    };
  };
  
  export default calculateGinRummyScore;
  