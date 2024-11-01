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
    index?:number
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
  const [p1DroppingCard, setP1DroppingCard] = useState<Card | null>(null); // 当前正在移动到 DropZone 的卡片

  
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
        // case null:
        //   alert('not your turn');
        //   break;
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
        // case null:
        //   alert('not your turn');
        //   break;
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
        // case null:
        //   alert('not your turn');
        //   break;
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
          handleP1Play()
      }
      
    };
  
    function handleP1Play() {
      if (remainingCards.length > 0) {
        const [newCard, ...rest] = remainingCards;
        setNextCard(newCard);
        setRemainingCards(rest);
        setSendingNewCard('stack');
        setP1Playing('toTake');
        
        setTimeout(() => {
          setPlayer1Cards((prev) => [...prev, newCard]);
          setNextCard(null);
          setP1Playing('toDrop');
   
          setTimeout(() => {
            console.log(player1Cards, player1Cards.length);
            if (player1Cards.length > 0) {
              const randomIndex = Math.floor(Math.random() * player1Cards.length);
              const randomCard = player1Cards[randomIndex];

             setP1DroppingCard({...randomCard, index:randomIndex});
    
              const updatedCards = [...player1Cards];
              updatedCards.splice(randomIndex, 0);
              setPlayer1Cards(updatedCards);
              console.log(player1Cards, player1Cards.length);
    
              setTimeout(() => {
                setDropZoneCards((prev) => [...prev, randomCard]);
                setP1Playing(null)
                setP1DroppingCard(null);
                setP2Playing('toTake')
              }, 400);
             
            }
          }, 1000);
        }, 1000);
      }
    }
    
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
    function AvatarDisplay({ image, player,name }: { image: string; player: 1 | 2, name:string }) {
      return (
        <div className="relative flex flex-col gap-2 items-center">
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
          <div className="text-lg font-medium text-gray-500 tracking-wide">{name}</div>
        </div>
      );
    }
  


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-col items-center justify-center">

        {/* Player1 avatar*/}
        <AvatarDisplay image={'/main-image/my-avatar.jpg'} player={1} name={'Robot'}/>

        <div className="relative flex items-center justify-center w-full h-[500px] gap-4">
            {/* Player1 */}
            {dealing &&
                player1Cards.map((card, index) => (
                  <motion.div
                  key={`player2-${index}`}
                  initial={sendingNewCard == 'dropzone'?  {x: 60,opacity:0.8}:{ x: -60, y: 0, opacity: 1}}
                  animate={{ 
                      x: -100 * (index - 5), 
                      y: -150, 
                      opacity: 1,}}
                  transition={{ 
                      delay: sendingNewCard? 0: index * 0.6,  
                      duration:0.8, 
                      type: 'spring',}}
                  className="absolute"
                  style={{zIndex: 6}}
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
            <div className="flex relative flex-row gap-6 items-center justify-center text-center">
                <Image
                    src="/cards-image/back.svg.png"
                    alt="Deck"
                    width={100}
                    height={150}
                    draggable="false"
                    className="object-contain"
                    style={{
                      cursor: p2Playing === 'toTake' ? 'pointer' : 'not-allowed', 
                      zIndex:1
                    }}
                    onClick={handleNext}
                />

                <DropZone />

                {p1DroppingCard && (
                  <motion.div
                    initial={{ x: p1DroppingCard.index? -100 * (p1DroppingCard.index-5) : -100, y: -150, opacity: 1 }} // 根据卡片位置调整 x 和 y
                    animate={{ x: 60, y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute"
                  >
                    <Image
                      src={p1DroppingCard.image}
                      alt={p1DroppingCard.name}
                      width={100}
                      height={150}
                      draggable="false"
                      className="object-contain"
                      style={{
                        zIndex:70
                      }}
                    />
                  </motion.div>
                )}

                {!dealing && (
                    <Button
                    className="absolute left-full ml-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                    onClick={() => setDealing(true)}
                    >
                    Deal
                    </Button>
                ) }
            </div>

            {/* Player2 */}
            {dealing && 
                player2Cards.map((card, index) => (
                <motion.div
                    key={`player2-${index}`}
                    initial={sendingNewCard == 'dropzone'?  {x: 60,opacity:0.5}:{ x: -60, y: 0, opacity: 0}}
                    animate={{ 
                        x: 100 * (index - 5), 
                        y: 150, 
                        opacity: 1,}}
                    transition={{ 
                        delay: sendingNewCard? 0:index * 0.6 + 0.3,  
                        duration:0.8, 
                        type: 'spring',}}
                    className="absolute"
                    style={{zIndex: 50}}
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
        <div className="relative flex items-center justify-center w-full">

        {dealing &&(
          <div  className="absolute flex flex-col items-center justify-center gap-2"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  left: 'calc(50% - 500px)',
                }}>
            
            <div
              className=" px-2 p-y-1 rounded-lg bg-gray-500 text-white  shadow-xl bg-opacity-60"
            >
              Melds: 
            </div>
            <div
              className=" px-2 p-y-1 rounded-lg bg-gray-500 text-white  shadow-xl bg-opacity-60"
            >
              Deadwoods: 
            </div>
            </div>
          )}


          <AvatarDisplay image={'/main-image/my-avatar-1.jpg'} player={2} name={'User'} />

          {p2Playing == 'toTake' && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={ 'PICK A CARD'}  bgColor={'bg-yellow-200'} />
              
            </div>
          )}
          {p2Playing == 'toDrop' && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={ 'DRAG & DROP A CARD'}  bgColor={'bg-yellow-200'} />
            </div>
          )}

          {dealing &&(
            <div
              className="absolute w-[80px] h-[80px] flex items-center justify-center bg-red-500 text-white font-semibold shadow-xl cursor-pointer hover:bg-red-600"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
                left: 'calc(50% + 500px)',
                borderRadius:'50%'
              }}
            >
              KNOCK
            </div>
          )}
                


  </div>
          
          
      </div>
    </DndProvider>
  )
}



import React from 'react';

interface ChatBubbleProps {
  content: string; 
  bgColor: string; 
}


const ChatBubble: React.FC<ChatBubbleProps> = ({ content, bgColor}) => {
  return (
    <div
      className={`relative ml-4 px-4 py-2 text-black font-semibold shadow-lg rounded-3xl max-w-xs ${bgColor} bg-opacity-60`}
      style={{
        transform: 'translateY(-80%)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {content}
      
      <div
        className={`absolute w-[20px] h-[20px] shadow-lg rounded-full ${bgColor} bg-opacity-60`}
        style={{
          left: '-25px',
          bottom: '-20px',
          transform: 'translateY(-50%)',
        }}
      />
      
      <div
        className={`absolute w-[10px] h-[10px] shadow-lg rounded-full ${bgColor} bg-opacity-60`}
        style={{
          left: '-40px',
          bottom: '-25px',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
};






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

