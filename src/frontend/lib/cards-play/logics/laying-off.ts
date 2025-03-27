// laying-off.ts
import { Card } from '../../models/card-animation.model';
import { decimalToDozenal } from './count-dozenal';

export function calculateLayingOff(opponentCards: Card[], knockerMelds: Card[]) {
  const updatedDeadwoods: Card[] = [];

  for (const card of opponentCards) {
    let canLayOff = false;

    for (const meld of splitMelds(knockerMelds)) {
      if (canBeLaidOff(card, meld)) {
        canLayOff = true;
        break;
      }
    }

    if (!canLayOff) {
      updatedDeadwoods.push(card);
    }
  }

  const adjustedDeadwoodPoint = updatedDeadwoods.reduce((sum, c) => sum + c.point, 0);

  return {
    adjustedDeadwoodPoint,
    updatedDeadwoods,
    updatedDeadwoodsPoint: adjustedDeadwoodPoint,
    updatedDeadwoodsDozenalPoint: decimalToDozenal(adjustedDeadwoodPoint),
  };
}

function splitMelds(cards: Card[]): Card[][] {
  const groups: Card[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < cards.length; i++) {
    if (used.has(i)) continue;

    const group = [cards[i]];
    used.add(i);

    for (let j = i + 1; j < cards.length; j++) {
      if (!used.has(j) && canBeGrouped(group[group.length - 1], cards[j])) {
        group.push(cards[j]);
        used.add(j);
      }
    }

    groups.push(group);
  }

  return groups;
}

function canBeGrouped(card1: Card, card2: Card): boolean {
  const [suit1, rank1] = card1.name.split('-');
  const [suit2, rank2] = card2.name.split('-');

  if (rank1 === rank2 && suit1 !== suit2) return true; // Set
  if (suit1 === suit2 && Math.abs(card1.order - card2.order) === 1) return true; // Run
  return false;
}

function canBeLaidOff(card: Card, meld: Card[]): boolean {
  if (meld.length < 3) return false;

  const isSet = meld.every(c => c.name.split('-')[1] === meld[0].name.split('-')[1]);
  const isRun = meld.every((c, i, arr) => i === 0 || c.order === arr[i - 1].order + 1);

  if (isSet) {
    return meld.some(c => c.name.split('-')[1] === card.name.split('-')[1]) &&
           !meld.some(c => c.name.split('-')[0] === card.name.split('-')[0]);
  }

  if (isRun) {
    const suit = meld[0].name.split('-')[0];
    const orders = meld.map(c => c.order).sort((a, b) => a - b);
    const cardOrder = card.order;
    return (
      card.name.split('-')[0] === suit &&
      (cardOrder === orders[0] - 1 || cardOrder === orders[orders.length - 1] + 1)
    );
  }

  return false;
}
