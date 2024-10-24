import { useDrag, useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { useRef } from 'react';

const ItemType = 'CARD';

interface DragItem {
  id: number;
  index: number;
}

interface PlayingCardProps {
  id: number;
  text: string;
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
}

export default function PlayingCard({ id, text, index, moveCard }: PlayingCardProps) {
  const ref = useRef<HTMLDivElement>(null);  // 用useRef来保存DOM引用

  const [, drop] = useDrop<DragItem>({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 将ref传递给drop和drag，同时避免回调嵌套问题
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="p-4 bg-white shadow-md rounded-md">
        {text}
      </Card>
    </div>
  );
}

