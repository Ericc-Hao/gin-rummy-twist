import { useState,useEffect, useRef } from 'react';
import { motion } from 'framer-motion'; 
import Image from 'next/image'; 

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from "@/components/ui/button"

import { CARDS,Card } from '../data/cards.data';
import {PlayerSummary} from './calc-score';
import GinRummyScore from './calc-score';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



interface DraggableCardProps {
    card: Card;
    index: number;
    moveCard: (fromIndex: number, toIndex: number) => void;
    p2Playing:'toTake'|'toDrop' | null
}
interface ChatBubbleProps {
  content: string; 
  bgColor: string; 
}
interface RoundData {
  round: number;
  p1Score: number;
  p1Bonus: number;
  p1Total: number;
  p2Score: number;
  p2Bonus: number;
  p2Total: number;
  result: string;
}
interface ScoreSummary {
  rounds: RoundData[];
  p1TotalScore: number;
  p2TotalScore: number;
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
  const [scoreSummary, setScoreSummary] = useState<ScoreSummary>()

  const [player1Cards, setPlayer1Cards] = useState<PlayerSummary>({cards:[]});
  const [player2Cards, setPlayer2Cards] = useState<PlayerSummary>({cards:[]});
  const [remainingCards, setRemainingCards] = useState<Card[]>([]); // remaining cards in main stack, 
  const [nextCard, setNextCard] = useState<Card | null>(null); // next card from main stack
  const [dropZoneCards, setDropZoneCards] = useState<Card[]>([]); // drop zone cards

  // get random stack of cards (shuffle the card)
  const shuffledCards = getRandomCards(CARDS); 
  const initialCardsNumber = 20

  function resetAll(){
    setDealing(false)
  }

  useEffect(() => {
    if (dealing) {
      // deal card to each player
      const initialCards = shuffledCards.slice(0, initialCardsNumber);
      const p1Cards = initialCards.filter((_, index) => index % 2 === 0);
      const p2Cards = initialCards.filter((_, index) => index % 2 !== 0);

      setPlayer1Cards(GinRummyScore(p1Cards));
      setPlayer2Cards(GinRummyScore(p2Cards));

      setP2Playing('toTake');
      setP1Playing(null)

      // update the remaining card
      setRemainingCards(shuffledCards.slice(initialCardsNumber));
     } else {
      setPlayer1Cards({cards:[]})
      setPlayer2Cards({cards:[]})
      setRemainingCards([])
      setDropZoneCards([])
      setSendingNewCard(null)
      
     }
    }, [dealing]);

    function moveCard(fromIndex: number, toIndex: number) {
      const updatedCards = [...player2Cards.cards];
      const [movedCard] = updatedCards.splice(fromIndex, 1); // 移动卡片
      updatedCards.splice(toIndex, 0, movedCard); // 在新位置插入卡片
      
      setPlayer2Cards({
        ...player2Cards, 
        cards: updatedCards, 
      });
    }

    // take the first card from main stack, remainingCards --
    function handleNext(){
      switch (p2Playing) {
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
  
            // setTimeout(() => {
              // add new cards to player2
              const updatedCards = [...player2Cards.cards, newCard]
              setPlayer2Cards(GinRummyScore(updatedCards));
              setNextCard(null);
            // }, 100);
          } else {
            if (dealing) {
              alert('No card to play!');
            } else {
              alert('Please deal the cards first!');
            }
          }
      }
    };

    // take the last card from drop zone, (LIFO), dropzone --
    function handleDropZone(){
      switch (p2Playing) {
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
              // add new cards to player2
              const updatedCards = [...player2Cards.cards, lastCard]
              setPlayer2Cards(GinRummyScore(updatedCards));
              setDropZoneCards(rest);
              setNextCard(null);
            }, 100);
          } else {
            // TODO: toast component(sooner)
            alert('No card in Drop Zone!');
          }
      }
    }

    // Player2 plays the card, dropzone ++
    function handleDrop(item: { card: Card; index: number }){
      switch (p2Playing) {
        case 'toTake':
          alert('need to pick a card first');
          break;
        case 'toDrop':
          setDropZoneCards([...dropZoneCards, item.card]);
          const updatedCards = [...player2Cards.cards];
          updatedCards.splice(item.index, 1);
          setPlayer2Cards(GinRummyScore(updatedCards));
          setP1Playing("toTake")
          setP2Playing(null)
          handleP1Play()
      }
    };
  
    // P1自动出牌
    function handleP1Play() {
      if (remainingCards.length > 0) {
        const [newCard, ...rest] = remainingCards;
        setNextCard(newCard);
        setRemainingCards(rest);
        setSendingNewCard('stack');
        setP1Playing('toTake');
        
        setTimeout(() => {
          // add new cards to player1
          const updatedP1Cards = [...player1Cards.cards, newCard]
          setPlayer1Cards(GinRummyScore(updatedP1Cards));
          setNextCard(null);
          setP1Playing('toDrop');
   
          setTimeout(() => {
            if (updatedP1Cards.length > 0) {
              const randomIndex = Math.floor(Math.random() * 11);
              const droppedCard = updatedP1Cards[randomIndex];
              console.log('******** P1 droppedCard: ',droppedCard,randomIndex);
              console.log('P2 Card: ',player2Cards);
              
              
              setP1DroppingCard({...droppedCard, index:randomIndex});
    
              updatedP1Cards.splice(randomIndex, 1);
              setPlayer1Cards(GinRummyScore(updatedP1Cards));
    
              setTimeout(() => {
                setDropZoneCards((prev) => [...prev, droppedCard]);
                setP1Playing(null)
                setP1DroppingCard(null);
                setP2Playing('toTake')
              }, 400);
            }
          }, 1000);
        }, 1000);
      }
    }

    function handleKnock(){
      console.log(player1Cards.DeadwoodsPoint, player2Cards.DeadwoodsPoint);

      const roundData = {
        round: (scoreSummary?.rounds?.length || 0) + 1,
        p1Score: 0, 
        p1Bonus: 0,
        p1Total: 0,  
        p2Score: player1Cards.DeadwoodsPoint! - player2Cards.DeadwoodsPoint!,
        p2Bonus: 0,
        p2Total: player1Cards.DeadwoodsPoint! - player2Cards.DeadwoodsPoint!,
        result: "Knock"
      };

      setScoreSummary(prev => {
        const prevSummary: ScoreSummary = prev || { rounds: [], p1TotalScore: 0, p2TotalScore: 0 };
    
        const updatedRounds = [...prevSummary.rounds, roundData];
    
        const p1TotalScore = updatedRounds.reduce((acc, round) => {
          return acc + round.p1Total;
        }, 0);
        const p2TotalScore = updatedRounds.reduce((acc, round) => {
          return acc + round.p2Total;
        }, 0);
        return {
          rounds: updatedRounds,
          p1TotalScore: p1TotalScore,
          p2TotalScore: p2TotalScore
        };
      });
    }
    
    function DropZone(){
      const [{ isOver }, drop] = useDrop({
        accept: 'CARD',
        drop: (item: { card: Card; index: number }) => handleDrop(item),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      });

      const ref = useRef<HTMLDivElement | null>(null);
      useEffect(() => {
        if (ref.current) {
          drop(ref.current);
        }
      }, [drop]);
    
      return (
        <div
          ref={ref}
          onClick={handleDropZone}
          className={`w-[100px] h-[136.72px] ${
            isOver ? 'bg-blue-200' : 'bg-white'
          } flex items-center justify-center relative`}
        >
          {dropZoneCards.map((card, idx) => (
            card && card.image ? (
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
            ) : (
              <p key={`dropzone-card-${idx}`} >Card image missing</p> // 或者显示占位符
            )
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
                player1Cards.cards.map((card, index) => (
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
                    {p1DroppingCard && p1DroppingCard.image ? (
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
                    ) : (
                      <p>Card image missing</p> // 或者显示占位符
                    )}
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
                player2Cards.cards.map((card, index) => (
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
                          index={index??10}
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
            

            <div className="px-2 py-1 flex flex-row items-center rounded-lg bg-gray-300 text-gray-700 shadow-xl bg-opacity-60 mt-4">
              <div className="flex items-center space-x-2">
                <span>Melds ({player2Cards.MeldsPoint}):</span>
                <div className="flex flex-row space-x-2">
                  {player2Cards.Melds?.map((card, index) => (
                    <div key={index} className={`font-black ${card.color}`}>
                      {card.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 flex flex-row items-center rounded-lg bg-gray-300 text-gray-700 shadow-xl bg-opacity-60 mt-4">
              <div className="flex items-center space-x-2">
                <span>Deadwoods ({player2Cards.DeadwoodsPoint}):</span>
                <div className="flex flex-row space-x-2">
                  {player2Cards.Deadwoods?.map((card, index) => (
                    <div key={index} className={`font-black ${card.color}`}>
                      {card.text}
                    </div>
                  ))}
                </div>
              </div>
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
            
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button>
                 */}
                 <div className="absolute w-[80px] h-[80px] flex items-center justify-center bg-red-500 text-white font-semibold shadow-xl cursor-pointer hover:bg-red-600"
                      style={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                        whiteSpace: 'nowrap',
                        left: 'calc(50% + 500px)',
                        borderRadius:'50%',
                        backgroundColor: player2Cards.DeadwoodsPoint && player2Cards.DeadwoodsPoint <= 10 ? 'red' : 'gray',
                        cursor: player2Cards.DeadwoodsPoint && player2Cards.DeadwoodsPoint <= 10 ? 'pointer' : 'not-allowed',
                      }}
                      onClick={handleKnock}
                    >
                      KNOCK
                  </div>
              </DialogTrigger>
              <DialogContent >
                <DialogHeader>
                  <DialogTitle className="flex flex-col items-center justify-center">You Win this round</DialogTitle>
                  <DialogDescription className="flex flex-col items-center justify-center"> Round end by knocking! </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Table>
                    <TableHeader className="bg-gray-200">
                      <TableRow>
                        <TableCell className="font-bold text-center"></TableCell>
                        <TableCell colSpan={3} className="font-bold text-center"> Robot</TableCell>
                        <TableCell colSpan={3} className="font-bold text-center"> You</TableCell>
                        <TableCell  className="font-bold text-center"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-center">Round</TableCell>
                        {/* Player 1 Headers */}
                        <TableCell className="font-bold text-center">Score</TableCell>
                        <TableCell className="font-bold text-center">Bonus</TableCell>
                        <TableCell className="font-bold text-center">Total</TableCell>
                        {/* Player 2 Headers */}
                        <TableCell className="font-bold text-center">Score</TableCell>
                        <TableCell className="font-bold text-center">Bonus</TableCell>
                        <TableCell className="font-bold text-center">Total</TableCell>
                        <TableCell className="font-bold text-center">Result</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>


                      {/* Scores for each player */}
                      {/* <TableRow>
                        <TableCell className="text-center">1</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">29</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">29</TableCell>
                        <TableCell className="text-center">Knock</TableCell>
                      </TableRow> */}
                      {/* Total Score Row */}
                      {/* <TableRow>
                        <TableCell className="font-semibold text-center">Total Score</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">29</TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">29</TableCell>
                        <TableCell className="text-center"></TableCell>
                      </TableRow> */}

{scoreSummary && scoreSummary.rounds.map((round, index) => (
        <TableRow key={index}>
          <TableCell className="text-center">{round.round}</TableCell>
          <TableCell className="text-center">{round.p1Score}</TableCell>
          <TableCell className="text-center">{round.p1Bonus}</TableCell>
          <TableCell className="text-center">{round.p1Total}</TableCell>
          <TableCell className="text-center">{round.p2Score}</TableCell>
          <TableCell className="text-center">{round.p2Bonus}</TableCell>
          <TableCell className="text-center">{round.p2Total}</TableCell>
          <TableCell className="text-center">{round.result}</TableCell>
        </TableRow>
      ))}
      {/* 总分行 */}
      <TableRow>
        <TableCell className="font-semibold text-center">Total Score</TableCell>
        <TableCell className="text-center">{scoreSummary?.p1TotalScore || 0}</TableCell>
        <TableCell className="text-center">0</TableCell>
        <TableCell className="text-center">{scoreSummary?.p1TotalScore || 0}</TableCell>
        <TableCell className="text-center">{scoreSummary?.p2TotalScore || 0}</TableCell>
        <TableCell className="text-center">0</TableCell>
        <TableCell className="text-center">{scoreSummary?.p2TotalScore || 0}</TableCell>
        <TableCell className="text-center"></TableCell>
      </TableRow>



                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={resetAll}>Play next round</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </DndProvider>
  )
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

  // console.log(card.name, index);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { card, index },
    collect: (monitor) => {
      if (monitor.isDragging()) {
        const draggedItem = monitor.getItem();
        console.log('Currently dragging card:', draggedItem.card.name, 'from index:', draggedItem.index);
      }
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
  });
  


  const [, drop] = useDrop({
    accept: 'CARD',
    hover: (item: { card: Card; index: number }) => {
      // console.log(`Dragging card ${card.name,card.image}from index ${item.index}`);
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    }, 
  });

  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      drag(drop(ref.current));
    }
  }, [drag, drop]);

  return (
    <motion.div
      ref={ref}
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
      {card && card.image ? (
        <Image
          src={card.image}
          alt={card.name}
          width={100}
          height={150}
          draggable="false"
          className="object-contain"
        />
      ) : (
        <p>Card image missing</p>
      )}
    </motion.div>
  );
};





