import React, { useState } from 'react';

// 定义 DraggableCard 的 props 类型
interface DraggableCardProps {
  card: string;
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
        padding: '16px',
        marginLeft: '-50px', // 实现50%覆盖
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'move',
        minWidth: '150px', // 卡片宽度，确保每张卡有空间
        textAlign: 'center',
        position: 'relative',
        zIndex: 100, // 确保拖动卡片在顶层
      }}
    >
      {card}
    </div>
  );
};

// 定义 CardContainer 的组件类型
const SortableCardList: React.FC = () => {
  const [cards, setCards] = useState<string[]>(['Card 1', 'Card 2', 'Card 3', 'Card 4']);

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
        alignItems: 'center', // 使卡片在垂直方向居中
        position: 'relative',
        padding: '16px',
      }}
    >
      {cards.map((card, index) => (
        <DraggableCard key={index} index={index} card={card} moveCard={moveCard} />
      ))}
    </div>
  );
};

export default SortableCardList;
