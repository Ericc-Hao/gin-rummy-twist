import { useState,useEffect } from 'react';
import { motion } from 'framer-motion'; 
import Image from 'next/image'; 

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CARDS } from '../data/cards.data';

import { Button } from "@/components/ui/button"

interface Card {
    name: string;
    image: string;
  }
interface DraggableCardProps {
    card: Card;
    index: number;
    moveCard: (fromIndex: number, toIndex: number) => void;
    p2Playing:'toTake'|'toDrop' | null
}
  

function getRandomCards(cards: Card[]): Card[] {
  return [...cards].sort(() => 0.5 - Math.random()); // set random rards
}

export default function DealCards() {
  const [dealing, setDealing] = useState(false); // if dealed
  const [sendingNewCard, setSendingNewCard] = useState<'stack'|'dropzone' | null>(null); // sending card from which stack
  const [p1Playing, setP1Playing] = useState<'toTake'|'toDrop' | null>(null);
  const [p2Playing, setP2Playing] = useState<'toTake'|'toDrop' | null>(null);
  
  const [player1Cards, setPlayer1Cards] = useState<Card[]>([]);
  const [player2Cards, setPlayer2Cards] = useState<Card[]>([]);
  const [remainingCards, setRemainingCards] = useState<Card[]>([]); // remaining cards in main stack, 
  const [nextCard, setNextCard] = useState<Card | null>(null); // next card from main stack
  const [dropZoneCards, setDropZoneCards] = useState<Card[]>([]); // drop zone cards

  // get random stack of cards (shuffle the card)
  const shuffledCards = getRandomCards(CARDS); 
  const initialCardsNumber = 20

  useEffect(() => {
    if (dealing) {
      // deal card to each player
      const initialCards = shuffledCards.slice(0, initialCardsNumber);
      const p1Cards = initialCards.filter((_, index) => index % 2 === 0);
      const p2Cards = initialCards.filter((_, index) => index % 2 !== 0);
      setPlayer1Cards(p1Cards);
      setPlayer2Cards(p2Cards);

      setP2Playing('toTake');
      setP1Playing(null)

      // update the remaining card
      setRemainingCards(shuffledCards.slice(initialCardsNumber));
     }
    }, [dealing]);

    function moveCard(fromIndex: number, toIndex: number){
        const updatedCards = [...player2Cards]
        // player === 1 ? [...player1Cards] : [...player2Cards];
        const [movedCard] = updatedCards.splice(fromIndex, 1); // 移动卡片
        updatedCards.splice(toIndex, 0, movedCard); // 在新位置插入卡片

        // if (player === 1) setPlayer1Cards(updatedCards);
        // else setPlayer2Cards(updatedCards);
        setPlayer2Cards(updatedCards)
    };

    const handlePass = () => {

    };


    // take the first card from main stack
    function handleNext(){
      switch (p2Playing) {
        case null:
          alert('not your tern');
          break;
        case 'toDrop':
          alert('You need to drop a card');
          break;
        case 'toTake':
          if (remainingCards.length > 0) {
            const [newCard, ...rest] = remainingCards;
            setNextCard(newCard); 
            setRemainingCards(rest);
            setSendingNewCard('stack'); 
            setP2Playing('toDrop');
  
            setTimeout(() => {
              setPlayer2Cards((prev) => [...prev, newCard]);
              setNextCard(null);
            }, 300);
          } else {
            if (dealing) {
              alert('No card to play!');
            } else {
              alert('Please deal the cards first!');
            }
          }
      }
    };

    // take the last card from drop zone, (LIFO)
    function handleDropZone(){
      switch (p2Playing) {
        case null:
          alert('not your tern');
          break;
        case 'toDrop':
          alert('You need to drop a card');
          break;
        case 'toTake':
          if (dropZoneCards.length > 0) {
            const [lastCard, ...rest] = [...dropZoneCards].reverse();
            setNextCard(lastCard);
            setSendingNewCard('dropzone');
            setP2Playing('toDrop');
    
            setTimeout(() => {
              setPlayer2Cards((prev) => [...prev, lastCard]);
              setDropZoneCards(rest);
              setNextCard(null);
            }, 300);
          } else {
            // TODO: toast component(sooner)
            alert('No card in Drop Zone!');
          }
      }
    }

    // Player2 plays the card
    function handleDrop(item: { card: Card; index: number }){
      switch (p2Playing) {
        case null:
          alert('not your tern');
          break;
        case 'toTake':
          alert('need to pick a card first');
          break;
        case 'toDrop':
          setDropZoneCards([...dropZoneCards, item.card]);
          const updatedCards = [...player2Cards];
          updatedCards.splice(item.index, 1);
          setPlayer2Cards(updatedCards);
          setP1Playing("toTake")
          setP2Playing(null)

          // TODO
          setTimeout(() => {
            setP1Playing(null)
            setP2Playing('toTake'); 
          }, 3000);
      }
      
    };
  

    function DropZone(){
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
          onClick={handleDropZone}
          className={`w-[100px] h-[136.72px] ${
            isOver ? 'bg-blue-200' : 'bg-white'
          } flex items-center justify-center relative`}
        >
          {dropZoneCards.map((card, idx) => (
            <Image
              key={`dropzone-card-${idx}`}
              src={card.image}
              alt={card.name}
              width={100}
              height={150}
              draggable="false"
              className="object-contain absolute cursor-pointer"
              style={{
                top: `0px`,
                left: `0px`,
                zIndex: idx,
                cursor: p2Playing === 'toTake' ? 'pointer' : 'not-allowed', 
              }}
            />
          ))}
        </div>
      );
    };

    // avatar
    function AvatarDisplay({ image, player }: { image: string; player: 1 | 2 }) {
      return (
        <div className="relative flex items-center">
          <Image
            src={image}
            alt={`Player ${player} Avatar`}
            width={100}
            height={100}
            className="object-contain"
            draggable="false"
            style={{
              borderRadius: '50%',
              boxShadow: (p2Playing && player == 2) || (p1Playing && player == 1)
                ? '0 0 20px rgba(250,225, 0, 1)'
                : 'none',
            }}
          />
        </div>
      );
    }
  


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-col items-center justify-center">

        {/* Player1 avatar*/}
        <AvatarDisplay image={'/main-image/my-avatar.jpg'} player={1} />

        <div className="relative flex items-center justify-center w-full h-[500px] gap-4">
            {/* Player1 */}
            {dealing &&
                player1Cards.map((card, index) => (
                    <motion.div
                        key={`player1-${index}`}
                        initial={{ x: -170, y: 0, opacity: 0 }}
                        animate={{
                            x: -100 * (index-5), 
                            y: -150, 
                            opacity: 1}}
                        transition={{
                            delay: index * 0.6,
                            duration: 0.8,
                            type: 'spring',}}
                        className="absolute"
                        >
                        <Image
                            src="/cards-image/back.svg.png"
                            alt={`Card ${index + 1}`}
                            width={100}
                            height={150}
                            draggable="false"
                            className="object-contain cursor-not-allowed"
                        />
                    </motion.div>
            ))}

            {/* middle card stack */}
            <div className="flex flex-row gap-6 items-center justify-center text-center">
                <Image
                    src="/cards-image/back.svg.png"
                    alt="Deck"
                    width={100}
                    height={150}
                    draggable="false"
                    className="object-contain"
                    style={{
                      cursor: p2Playing === 'toTake' ? 'pointer' : 'not-allowed', 
                    }}
                    onClick={handleNext}
                />

                <DropZone />

                {!dealing ? (
                    <Button
                    className="mb-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                    onClick={() => setDealing(true)}
                    >
                    Deal
                    </Button>
                ) : (
                    <Button className="w-[100px]" onClick={handlePass}>
                        Pass
                    </Button>
                )}
            </div>

            {/* Player2 */}
            {dealing && 
                player2Cards.map((card, index) => (
                <motion.div
                    key={`player2-${index}`}
                    initial={sendingNewCard == 'dropzone'?  {x: 0,opacity:1}:{ x: -124, y: 0, opacity: 0}}
                    animate={{ 
                        x: 100 * (index - 5), 
                        y: 150, 
                        opacity: 1,}}
                    transition={{ 
                        delay: sendingNewCard? 0:index * 0.6 + 0.3,  
                        duration:0.8, 
                        type: 'spring',}}
                    className="absolute"
                    >
                      <DraggableCard
                          key={index}
                          index={index}
                          card={card}
                          moveCard={(from, to) => moveCard(from, to)}
                          p2Playing ={p2Playing}
                      />
                </motion.div>
                ))}
        </div>

        {/* Player2 avatar*/}
        <div className="relative flex items-center">
          <AvatarDisplay image={'/main-image/my-avatar-1.jpg'} player={2} />
          {p2Playing == 'toTake' && (
            <div
              className="absolute left-full ml-4 p-2 rounded-lg  bg-green-300 text-black font-semibold"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              PICK A CARD
            </div>
          )}
          {p2Playing == 'toDrop' && (
            <div
              className="absolute left-full ml-4 p-2 rounded-lg bg-red-300 text-black font-semibold"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              DRAG & DROP A CARD
            </div>
          )}


  </div>
          
          
      </div>
    </DndProvider>
  )
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, index, moveCard,p2Playing }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { card, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover: (item: { card: Card; index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        opacity: isDragging ? 0 : 1,
        margin: '0 5px',
        backgroundColor: '#fff',
        // cursor: 'pointer',
        cursor:  p2Playing ? 'pointer' : 'not-allowed',
        textAlign: 'center',
      }}
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

