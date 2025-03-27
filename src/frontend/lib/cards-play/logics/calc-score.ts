// import { Card,PlayerSummary } from '../models/card-animation.model';
// import { decimalToDozenal } from './count-dozenal';

// type CalcScoreCard = {
//     order: number,
//     point: number;
//     name: string;
//     image: string;
//   };
  
//   const calculateGinRummyScore = (CalcScoreCards: CalcScoreCard[]): PlayerSummary & { Sets: CalcScoreCard[]; Runs: CalcScoreCard[] } => {
//     const suits: { [key: string]: CalcScoreCard[] } = {};
//     const ranks: { [key: string]: CalcScoreCard[] } = {};
  
//     CalcScoreCards.forEach((CalcScoreCard) => {
//       const [suit, rank] = CalcScoreCard.name.split('-');
//       if (!suits[suit]) suits[suit] = [];
//       suits[suit].push(CalcScoreCard);
  
//       if (!ranks[rank]) ranks[rank] = [];
//       ranks[rank].push(CalcScoreCard);
//     });
  
//     // 计算所有可能的同花顺 (run) 和相同牌面组合 (set)
//     const calculateMelds = () => {
//       const runGroups: { melds: CalcScoreCard[]; meldsPoint: number }[] = [];
//       const setGroups: { melds: CalcScoreCard[]; meldsPoint: number }[] = [];
  
//       // 计算同花顺
//       for (const suit in suits) {
//         const suitCards = suits[suit];
//         if (suitCards.length >= 3) {
//           const sortedSuitCards = suitCards.sort((a, b) => a.order - b.order);
//           for (let i = 0; i < sortedSuitCards.length; i++) {
//             const currentRun: CalcScoreCard[] = [sortedSuitCards[i]];
//             for (let j = i + 1; j < sortedSuitCards.length; j++) {
//               if (sortedSuitCards[j].order === currentRun[currentRun.length - 1].order + 1) {
//                 currentRun.push(sortedSuitCards[j]);
//                 if (currentRun.length >= 3) {
//                   runGroups.push({
//                     melds: [...currentRun],
//                     meldsPoint: currentRun.reduce((sum, card) => sum + card.point, 0),
//                   });
//                 }
//               } else {
//                 break;
//               }
//             }
//           }
//         }
//       }
  
//       // 计算相同牌面组合 (set)
//       for (const rank in ranks) {
//         const rankCards = ranks[rank];
//         if (rankCards.length >= 3) {
//           const combinations = (array: CalcScoreCard[], size: number): CalcScoreCard[][] => {
//             if (size > array.length) return [];
//             if (size === array.length) return [array];
//             if (size === 1) return array.map((el) => [el]);
//             const result: CalcScoreCard[][] = [];
//             array.forEach((el, index) => {
//               const smallerCombinations = combinations(array.slice(index + 1), size - 1);
//               smallerCombinations.forEach((comb) => {
//                 result.push([el, ...comb]);
//               });
//             });
//             return result;
//           };
//           for (let size = 3; size <= rankCards.length; size++) {
//             const sets = combinations(rankCards, size);
//             sets.forEach((set) => {
//               setGroups.push({
//                 melds: set,
//                 meldsPoint: set.reduce((sum, card) => sum + card.point, 0),
//               });
//             });
//           }
//         }
//       }
  
//       return { runGroups, setGroups };
//     };
  
//     const { runGroups, setGroups } = calculateMelds();
//     const usedCards: Set<CalcScoreCard> = new Set();
//     const bestRuns: CalcScoreCard[] = [];
//     const bestSets: CalcScoreCard[] = [];
  
//     runGroups.sort((a, b) => b.meldsPoint - a.meldsPoint || b.melds.length - a.melds.length);
//     setGroups.sort((a, b) => b.meldsPoint - a.meldsPoint || b.melds.length - a.melds.length);
  
//     // 选择最佳的 Runs
//     runGroups.forEach((runGroup) => {
//       const canUseRun = runGroup.melds.every((card) => !usedCards.has(card));
//       if (canUseRun) {
//         bestRuns.push(...runGroup.melds);
//         runGroup.melds.forEach((card) => usedCards.add(card));
//       }
//     });
  
//     // 选择最佳的 Sets
//     setGroups.forEach((setGroup) => {
//       const canUseSet = setGroup.melds.every((card) => !usedCards.has(card));
//       if (canUseSet) {
//         bestSets.push(...setGroup.melds);
//         setGroup.melds.forEach((card) => usedCards.add(card));
//       }
//     });
  
//     const bestMeldsPoint = [...bestRuns, ...bestSets].reduce((sum, card) => sum + card.point, 0);
//     const deadwoods = CalcScoreCards.filter((CalcScoreCard) => !usedCards.has(CalcScoreCard));
//     const deadwoodsPoint = deadwoods.reduce((sum, CalcScoreCard) => sum + CalcScoreCard.point, 0);
  
//     return {
//       cards: CalcScoreCards,
//       Melds: [...bestRuns, ...bestSets],
//       MeldsPoint: bestMeldsPoint,
//       Deadwoods: deadwoods,
//       DeadwoodsPoint: deadwoodsPoint,
//       DeadwoodsDozenalPoint:decimalToDozenal(deadwoodsPoint),
//       Sets: bestSets,
//       Runs: bestRuns,
//     };
//   };
  
//   export default calculateGinRummyScore;


import { Card, PlayerSummary } from '../../models/card-animation.model';
import { decimalToDozenal } from './count-dozenal';

type CalcScoreCard = {
  order: number,
  point: number;
  name: string;
  image: string;
};

const calculateGinRummyScore = (CalcScoreCards: CalcScoreCard[]): PlayerSummary & { Sets: CalcScoreCard[]; Runs: CalcScoreCard[] } => {
  const suits: { [key: string]: CalcScoreCard[] } = {};
  const ranks: { [key: string]: CalcScoreCard[] } = {};

  CalcScoreCards.forEach((card) => {
    const [suit, rank] = card.name.split('-');
    if (!suits[suit]) suits[suit] = [];
    suits[suit].push(card);

    if (!ranks[rank]) ranks[rank] = [];
    ranks[rank].push(card);
  });

  // const findRuns = (): CalcScoreCard[][] => {
  //   const runs: CalcScoreCard[][] = [];
  //   for (const suit in suits) {
  //     const cards = suits[suit].sort((a, b) => a.order - b.order);
  //     for (let i = 0; i < cards.length; i++) {
  //       const run = [cards[i]];
  //       for (let j = i + 1; j < cards.length; j++) {
  //         if (cards[j].order === run[run.length - 1].order + 1) {
  //           run.push(cards[j]);
  //           if (run.length >= 3) runs.push([...run]);
  //         } else if (cards[j].order !== run[run.length - 1].order) {
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   return runs;
  // };

  const findRuns = (): CalcScoreCard[][] => {
    const runs: CalcScoreCard[][] = [];
  
    for (const suit in suits) {
      const cards = suits[suit]
        .slice() // 避免原地排序
        .sort((a, b) => a.order - b.order);
  
      for (let i = 0; i < cards.length; i++) {
        const run: CalcScoreCard[] = [cards[i]];
        for (let j = i + 1; j < cards.length; j++) {
          const prevCard = run[run.length - 1];
          const currentCard = cards[j];
  
          // 只允许严格递增且连续的 order
          if (currentCard.order === prevCard.order + 1) {
            run.push(currentCard);
            if (run.length >= 3) {
              runs.push([...run]);
            }
          } else if (currentCard.order > prevCard.order + 1) {
            break; // 跳号了，停止这条 run 构建
          }
        }
      }
    }
  
    return runs;
  };
  
  const findSets = (): CalcScoreCard[][] => {
    const sets: CalcScoreCard[][] = [];
    for (const rank in ranks) {
      const group = ranks[rank];
      if (group.length >= 3) {
        for (let size = 3; size <= group.length; size++) {
          const combinations = (arr: CalcScoreCard[], size: number): CalcScoreCard[][] => {
            if (size > arr.length) return [];
            if (size === arr.length) return [arr];
            if (size === 1) return arr.map((el) => [el]);
            const result: CalcScoreCard[][] = [];
            arr.forEach((el, index) => {
              const rest = combinations(arr.slice(index + 1), size - 1);
              rest.forEach((r) => result.push([el, ...r]));
            });
            return result;
          };
          combinations(group, size).forEach((c) => sets.push(c));
        }
      }
    }
    return sets;
  };

  const allRuns = findRuns();
  const allSets = findSets();
  const allMeldCombos: { melds: CalcScoreCard[][]; used: Set<string> }[] = [];

  const explore = (melds: CalcScoreCard[][], used: Set<string>, index: number) => {
    if (index === allRuns.length + allSets.length) {
      allMeldCombos.push({ melds: [...melds], used: new Set(used) });
      return;
    }
    const group = index < allRuns.length ? allRuns[index] : allSets[index - allRuns.length];
    const groupUsed = group.some((card) => used.has(card.name));
    explore(melds, used, index + 1);
    if (!groupUsed) {
      const newUsed = new Set(used);
      group.forEach((card) => newUsed.add(card.name));
      explore([...melds, group], newUsed, index + 1);
    }
  };

  explore([], new Set(), 0);

  let bestCombo: { melds: CalcScoreCard[][]; deadwood: number; runs: CalcScoreCard[][]; sets: CalcScoreCard[][] } = {
    melds: [],
    deadwood: Infinity,
    runs: [],
    sets: []
  };

  allMeldCombos.forEach(({ melds, used }) => {
    const meldCards = melds.flat();
    const deadwoods = CalcScoreCards.filter((c) => !used.has(c.name));
    const deadwoodPoint = deadwoods.reduce((sum, c) => sum + c.point, 0);
    const runMelds = melds.filter((g) => g.length >= 3 && g.every((c, i, a) => i === 0 || c.order === a[i - 1].order + 1));
    const setMelds = melds.filter((g) => g.length >= 3 && g.every((c) => c.name.split('-')[1] === g[0].name.split('-')[1]));

    if (
      deadwoodPoint < bestCombo.deadwood ||
      (deadwoodPoint === bestCombo.deadwood && meldCards.length > bestCombo.melds.flat().length)
    ) {
      bestCombo = { melds, deadwood: deadwoodPoint, runs: runMelds, sets: setMelds };
    }
  });

  const usedCards = new Set(bestCombo.melds.flat().map((c) => c.name));
  const deadwoods = CalcScoreCards.filter((c) => !usedCards.has(c.name));

  return {
    cards: CalcScoreCards,
    Melds: bestCombo.melds.flat(),
    MeldsPoint: bestCombo.melds.flat().reduce((s, c) => s + c.point, 0),
    Deadwoods: deadwoods,
    DeadwoodsPoint: bestCombo.deadwood,
    DeadwoodsDozenalPoint: decimalToDozenal(bestCombo.deadwood),
    Runs: bestCombo.runs.flat(),
    Sets: bestCombo.sets.flat()
  };
};

export default calculateGinRummyScore;
