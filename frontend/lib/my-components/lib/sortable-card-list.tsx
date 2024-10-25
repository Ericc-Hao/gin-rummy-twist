import React, { useState } from 'react';
import { CARDS, Card } from '../data/cards.data'; // 导入卡片数据

import Image from 'next/image';

// 定义卡片数据的类型
interface Card {
  name: string;
  image: string;
}

// 定义 DraggableCard 的 props 类型
interface DraggableCardProps {
  card: Card;
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, index, moveCard }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', index.toString()); // 将当前卡片的索引存储在数据传输对象中
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10); // 获取源索引并转换为数字
    moveCard(fromIndex, index); // 调用父组件的方法移动卡片
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // 防止默认行为以允许放置
      style={{
        marginLeft: '-1px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'move',
        // minWidth: '150px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 100,
      }}
    >
       <Image src={card.image} 
              alt={card.name} 
              width={100} 
              height={150}
              className="object-contain"/>
    </div>
  );
};

function SortableCardList({display_cards_list}:{display_cards_list: string[]}) {

  function getSortedCards(list: string[], cards: Card[]){
    return list
      .map((name) => cards.find((card) => card.name === name))
      .filter((card): card is Card => card !== undefined); 
  };


  const [cards, setCards] = useState<Card[]>(getSortedCards(display_cards_list, CARDS));

  const moveCard = (fromIndex: number, toIndex: number) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1); // 移动卡片
    updatedCards.splice(toIndex, 0, movedCard); // 在新位置插入卡片
    setCards(updatedCards); // 更新状态
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '16px',
        zIndex: 0,
      }}
    >
      {cards.map((card, index) => (
        <DraggableCard key={index} index={index} card={card} moveCard={moveCard} />
      ))}
    </div>
  );
};

export default SortableCardList;
