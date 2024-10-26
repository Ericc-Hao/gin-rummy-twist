import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableCard from "@/lib/my-components/sortable-card-list"

import { CARDS } from '../data/cards.data';
import { Button } from "@/components/ui/button";

type Card = {
  name: string;
  image: string;
};

function getRandomCards(cards: Card[]): Card[] {
  return [...cards].sort(() => 0.5 - Math.random()); // 随机打乱数组
}

export default function DealCards() {
  const [dealing, setDealing] = useState(false);
  const [player1Cards, setPlayer1Cards] = useState<Card[]>([]);
  const [player2Cards, setPlayer2Cards] = useState<Card[]>([]);
  const [playedCard, setPlayedCard] = useState<Card | null>(null); // 记录被拖放到白框的卡片

  const shuffledCards = getRandomCards(CARDS);

  useEffect(() => {
    if (dealing) {
      const initialCards = shuffledCards.slice(0, 20);
      const p1Cards = initialCards.filter((_, index) => index % 2 === 0);
      const p2Cards = initialCards.filter((_, index) => index % 2 !== 0);

      setPlayer1Cards(p1Cards);
      setPlayer2Cards(p2Cards);
    }
  }, [dealing]);

  // 设置拖拽
  const CardDraggable = ({ card, index }: { card: Card; index: number }) => {
    const [, drag] = useDrag({
      type: 'CARD',
      item: { card, index },
    });

    return (
      <motion.div
        ref={drag}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="m-2"
      >
        <Image
          src={card.image}
          alt={card.name}
          width={100}
          height={150}
          draggable="false"
          className="object-contain"
        />
      </motion.div>
    );
  };

  // 设置放置区域
  const DropZone = () => {
    const [{ isOver }, drop] = useDrop({
      accept: 'CARD',
      drop: (item: { card: Card; index: number }) => handleDrop(item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`w-[100px] h-[136.72px] ${
          isOver ? 'bg-blue-200' : 'bg-white'
        } flex items-center justify-center`}
      >
        {playedCard && (
          <motion.div
            key={playedCard.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={playedCard.image}
              alt={playedCard.name}
              width={100}
              height={150}
              draggable="false"
              className="object-contain"
            />
          </motion.div>
        )}
      </div>
    );
  };

  const handleDrop = (item: { card: Card; index: number }) => {
    setPlayedCard(item.card);

    // 从玩家 2 的手牌中移除已拖拽的卡片
    const updatedCards = [...player2Cards];
    updatedCards.splice(item.index, 1);
    setPlayer2Cards(updatedCards);
  };

  const moveCard = (fromIndex: number, toIndex: number, player: number) => {
            const updatedCards =
            player === 1 ? [...player1Cards] : [...player2Cards];
            const [movedCard] = updatedCards.splice(fromIndex, 1); // 移动卡片
            updatedCards.splice(toIndex, 0, movedCard); // 在新位置插入卡片
    
            if (player === 1) setPlayer1Cards(updatedCards);
            else setPlayer2Cards(updatedCards);
        };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Image
          src={'/main-image/my-avatar.jpg'}
          alt={'My Avatar'}
          width={100}
          height={100}
          className="object-contain"
          draggable="false"
          style={{ borderRadius: '50%' }}
        />

<div className="relative flex flex-col items-center justify-center w-full h-[500px] gap-4">
                {/* Player1 */}
                <div className="flex items-center justify-center">
                {dealing &&
                player1Cards.map((card, index) => (
                    <motion.div
                        key={`player1-${index}`}
                        initial={{ x: -170, y: 0, opacity: 0 }}
                        animate={{
                            x: -100 * (index-5), // 从右往左排列
                            y: -150, // 向上飞出
                            opacity: 1,
                        }}
                        transition={{
                            delay: index * 0.6, // 每张牌的动画延迟
                            duration: 0.8,
                            type: 'spring',
                        }}
                        className="absolute"
                        >
                        <Image
                            src="/cards-image/back.svg.png"
                            alt={`Card ${index + 1}`}
                            width={100}
                            height={150}
                            draggable="false"
                            className="object-contain"
                        />
                    </motion.div>
            ))}
            </div>


          {/* 中间卡牌区域 */}
          <div className="flex flex-row gap-6 items-center justify-center text-center">
            <Image
              src="/cards-image/back.svg.png"
              alt="Deck"
              width={100}
              height={150}
              draggable="false"
              className="object-contain"
              onClick={() => setDealing(true)}
            />

            {/* Drop Zone for Player 2 */}
            <DropZone />

            {!dealing ? (
              <Button
                className="mb-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                onClick={() => setDealing(true)}
              >
                Deal
              </Button>
            ) : (
              <Button className="w-[100px]">Pass</Button>
            )}
          </div>

          {/* Player2 - 手牌容器居中对齐 */}
          {dealing && (
            <div className="flex items-center justify-center">
              {player2Cards.map((card, index) => (
                <CardDraggable key={index} card={card} index={index} />
              ))}
            </div>
          )}


{/* {dealing && 
                player2Cards.map((card, index) => (
                <motion.div
                    key={`player2-${index}`}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                    x: 100 * (index - 5), // 从左到右排列
                    y: 150, // 向下移动
                    opacity: 1,
                    }}
                    transition={{
                    delay: index * 0.6 + 0.3, // 动画延迟
                    duration: 0.8,
                    type: 'spring',
                    }}
                    className="absolute"
                >
                    {/* 
                    <DraggableCard
                        key={index}
                        index={index}
                        card={card}
                        moveCard={(from, to) => moveCard(from, to, 2)}
                    />
                </motion.div>
                ))} */}
        </div>

        <Image
          src={'/main-image/my-avatar-1.jpg'}
          alt={'My Avatar'}
          width={100}
          height={100}
          className="object-contain"
          draggable="false"
          style={{ borderRadius: '50%' }}
        />
      </div>
    </DndProvider>
  );
}


