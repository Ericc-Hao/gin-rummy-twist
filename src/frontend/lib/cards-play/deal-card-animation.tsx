import { useState,useEffect, useRef } from 'react';
import { motion } from 'framer-motion'; 
import Image from 'next/image'; 

import { useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from "@/components/ui/button"

import { CARDS } from '../data/cards.data';
import { Card,PlayerSummary } from '../models/card-animation.model';
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

import { ScoreSummary,playingStatus,passingStatus,sendingNewCardPlace } from '../models/card-animation.model';
import { DraggableCard} from './drag-card'
import { decimalToDozenal } from './count-dozenal';
import { AvatarDisplay,ChatBubble  } from '@my-components/avatar'

function getRandomCards(cards: Card[]): Card[] {
  return [...cards].sort(() => 0.5 - Math.random()); // set random rards
}

export default function DealCards() {
  const [dealing, setDealing] = useState(false);
  const [currentPass, setCurrentPass] = useState<passingStatus>(null)

  const [p1Playing, setP1Playing] = useState<playingStatus>(null);
  const [p2Playing, setP2Playing] = useState<playingStatus>(null);
  const [player1Cards, setPlayer1Cards] = useState<PlayerSummary>({cards:[]});
  const [player2Cards, setPlayer2Cards] = useState<PlayerSummary>({cards:[]});

  const [p1DroppingCard, setP1DroppingCard] = useState<Card | null>(null); // p1 dropping card
  const [sendingNewCard, setSendingNewCard] = useState<sendingNewCardPlace>(null); // sending card from stack or dropzone
  const [remainingCards, setRemainingCards] = useState<Card[]>([]); // remaining cards in main stack, 
  const [dropZoneCards, setDropZoneCards] = useState<Card[]>([]); // drop zone cards

  const [scoreSummary, setScoreSummary] = useState<ScoreSummary>()

  // get random stack of cards (shuffle the card)
  const shuffledCards = getRandomCards(CARDS); 
  const initialCardsNumber = 24

  function resetAll(){
    setDealing(false)
  }

  useEffect(() => {
    if (dealing) {
      // deal card to each player
      const initialCards = shuffledCards.slice(0, initialCardsNumber + 1);
      const firstCard = initialCards.pop();
      if (firstCard) {
        setDropZoneCards([firstCard]);
      }
      const p1Cards = initialCards.filter((_, index) => index % 2 === 0);
      const p2Cards = initialCards.filter((_, index) => index % 2 !== 0);

      setPlayer1Cards(GinRummyScore(p1Cards));
      setPlayer2Cards(GinRummyScore(p2Cards));

      setTimeout(() => {
        setCurrentPass(2)
      }, 7400);
     
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

    // 点击Pass按钮，P1拿最开始的牌
    function handlePass(){
      setP2Playing(null);
      setP1Playing('toTake')
      handleP1Play('dropzone')
      setCurrentPass(null)
    }

    // p2 拖动时move card
    function moveCard(fromIndex: number, toIndex: number, wholeCardList: Card[]) {
      const [movedCard] = wholeCardList.splice(fromIndex, 1);
      wholeCardList.splice(toIndex, 0, movedCard);
      setPlayer2Cards({
        ...player2Cards, 
        cards: wholeCardList, 
      });
    }

    // P2从stack拿 下一张牌
    function handleNext(){
      switch (p2Playing) {
        case 'toDrop':
          alert('You need to drop a card');
          break;
        case 'toTake':
          if (remainingCards.length > 0) {
            const [newCard, ...rest] = remainingCards;
            setRemainingCards(rest);
            setSendingNewCard('stack'); 
            setP2Playing('toDrop');
            const updatedCards = [...player2Cards.cards, newCard]
            setPlayer2Cards(GinRummyScore(updatedCards));
          } else {
            if (dealing) {
              alert('No card to play!');
            } else {
              alert('Please deal the cards first!');
            }
          }
      }
    };

    // P2从dropzone拿 下一张牌
    // dropzone拿牌规则：LIFO，新牌添加在最后，pop取出，显示是从后往前显示
    function handleDropZone(){
      if (p2Playing == 'toTake' || currentPass == 2){
        if (currentPass == 2) {
          setCurrentPass(null)
        }
        if (dropZoneCards && dropZoneCards.length > 0) {
          const lastCard = dropZoneCards.pop()
          if (lastCard) {
            setSendingNewCard('dropzone');
            setP2Playing('toDrop');
            setTimeout(() => {
              const updatedCards = [...player2Cards.cards, lastCard]
              setPlayer2Cards(GinRummyScore(updatedCards));
              setDropZoneCards(dropZoneCards);
            }, 100);
          } 
        } else {
          // TODO: toast component(sooner)
          alert('No card in Drop Zone!');
        }
      }
    }

    // P2出牌到dropzone，添加在最后一张
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
          handleP1Play('stack')
      }
    };
  
    // P1自动出牌
    function handleP1Play(place:'dropzone'|'stack') {
      if (place == 'dropzone') {
        if (dropZoneCards.length > 0) {
          const lastCard = dropZoneCards.pop()
          if (lastCard) {
            setDropZoneCards(dropZoneCards);
            setSendingNewCard('dropzone');
            setP1Playing('toTake');
            handleP1PickAndDrop(lastCard)
          }
        }
      } else if (place == 'stack'){
          if (remainingCards.length > 0) {
            const [newCard, ...rest] = remainingCards;
            // setNextCard(newCard);
            setRemainingCards(rest);
            setSendingNewCard('stack');
            setP1Playing('toTake');
            handleP1PickAndDrop(newCard)
          }
      }
    }
    function handleP1PickAndDrop(newCard: Card){
      // mock P1 拿牌
      setTimeout(() => {
        const updatedP1Cards = [...player1Cards.cards, newCard]
        setPlayer1Cards(GinRummyScore(updatedP1Cards));
        setP1Playing('toDrop');
        // mock P1 出牌
        setTimeout(() => {
          if (updatedP1Cards.length > 0) {
            const randomIndex = Math.floor(Math.random() * 13);
            const droppedCard = updatedP1Cards[randomIndex];
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
      }, 300);
    }

    function handleKnock(){
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
                  cursor: p2Playing === 'toTake' || currentPass == 2 ? 'pointer' : 'not-allowed', 
                }}
              />
            ) : (
              <p key={`dropzone-card-${idx}`} >Card image missing</p>
            )
          ))}
        </div>
      );
    };

  return (
    <DndProvider backend={HTML5Backend}>

      <div className="h-full w-full flex flex-col items-center justify-center select-none">

        {/* Player1 avatar*/}
        <AvatarDisplay image={'/main-image/avatar-robot.jpg'} player={1} name={'Robot'} p2Playing={p2Playing} p1Playing={p1Playing} currentPass={currentPass}/>

        <div className="relative flex items-center justify-center w-full h-[500px] gap-4">
            {/* Player1 */}
            {dealing &&
                player1Cards.cards.map((card, index) => (
                  <motion.div
                  key={`player2-${index}`}
                  initial={sendingNewCard == 'dropzone'?  {x: 60,opacity:0.8}:{ x: -75, y: 0, opacity: 1}}
                  animate={{ 
                      x: -100 * (index - 6), 
                      y: -150, 
                      opacity: 1,}}
                  transition={{ 
                      delay: sendingNewCard? 0: index * 0.6,  
                      duration:0.8, 
                      type: 'spring',}}
                  className="absolute"
                  style={{zIndex: 6,boxShadow: '0 4px 8px rgba(255, 255, 255, 0.5)'}}
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
                      zIndex:1,
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onClick={handleNext}
                />

                <DropZone />

                {p1DroppingCard && (
                  <motion.div
                    initial={{ x: p1DroppingCard.index? -100 * (p1DroppingCard.index-5) : -100, y: -150, opacity: 1 }} 
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
                          zIndex:7
                        }}
                      />
                    ) : (
                      <p>Card image missing</p>
                    )}
                  </motion.div>
                )}

                {!dealing? (
                    <Button
                    className="absolute left-full ml-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                    onClick={() => setDealing(true)}
                    >
                    Deal
                    </Button>
                ) :(
                  <div>
                    {currentPass && (
                    <Button
                    className="absolute left-full ml-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                    onClick={() => handlePass()}
                    >
                    Pass
                    </Button>
                ) }
                  </div>
                ) }
            </div>

            {/* Player2 */}
            {dealing && 
                player2Cards.cards.map((card, index) => (
                <motion.div
                    key={`player2-${index}`}
                    initial={sendingNewCard == 'dropzone'?  {x: 60,opacity:0.5}:{ x: -75, y: 0, opacity: 0}}
                    animate={{ 
                        x: 100 * (index - 6), 
                        y: 150, 
                        opacity: 1,}}
                    transition={{ 
                        delay: sendingNewCard? 0:index * 0.6 + 0.3,  
                        duration:0.8, 
                        type: 'spring',}}
                    className="absolute"
                    style={{zIndex: 50,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}
                    >
                      <DraggableCard
                          key={index}
                          index={index??10}
                          card={card}
                          moveCard={(from, to,wholeCardList) => moveCard(from, to,wholeCardList)}
                          p2Playing ={p2Playing}
                          wholeCardList = {player2Cards.cards}
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
                <span>Sets:</span>
                <div className="flex flex-row space-x-2">
                  {player2Cards.Sets?.map((card, index) => (
                    <div key={index} className={`font-black ${card.color}`}>
                      {card.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 flex flex-row items-center rounded-lg bg-gray-300 text-gray-700 shadow-xl bg-opacity-60 mt-4">
              <div className="flex items-center space-x-2">
                <span>Runs:</span>
                <div className="flex flex-row space-x-2">
                  {player2Cards.Runs?.map((card, index) => (
                    <div key={index} className={`font-black ${card.color}`}>
                      {card.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-2 py-1 flex flex-row items-center rounded-lg bg-gray-300 text-gray-700 shadow-xl bg-opacity-60 mt-4">
              <div className="flex items-center space-x-2">
                <span>Deadwood ({player2Cards.DeadwoodsDozenalPoint}):</span>
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


          <AvatarDisplay image={'/main-image/avatar-user.jpg'} player={2} name={'User'}  p2Playing={p2Playing} p1Playing={p1Playing} currentPass={currentPass}/>


          {!dealing && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={'CLICK DEAL'}  bgColor={'bg-yellow-200'} />
            </div>
          )}
          {currentPass == 2 && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={'DRAW OR PASS'}  bgColor={'bg-yellow-200'} />
              
            </div>
          )}
          {p2Playing == 'toTake' && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={'PICK A CARD'}  bgColor={'bg-yellow-200'} />
              
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
                <ChatBubble content={ 'DRAG TO DISCARD'}  bgColor={'bg-yellow-200'} />
            </div>
          )}

          {dealing &&(
            <Dialog>
              <DialogTrigger asChild>
                 <div className="absolute w-[80px] h-[80px] flex items-center justify-center bg-red-500 text-white font-semibold shadow-xl cursor-pointer hover:bg-red-600"
                      style={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                        whiteSpace: 'nowrap',
                        left: 'calc(50% + 500px)',
                        borderRadius:'50%',
                        backgroundColor: player2Cards.DeadwoodsPoint && player2Cards.DeadwoodsPoint <= 12 ? 'red' : 'gray',
                        cursor: player2Cards.DeadwoodsPoint && player2Cards.DeadwoodsPoint <= 12 ? 'pointer' : 'not-allowed',
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
                          {/* TODO: 这里之后要改，存的时候就存dozenal的 */}
                            <TableRow>
                              <TableCell className="font-semibold text-center">Total Score</TableCell>
                              <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p1TotalScore || 0) }</TableCell>
                              <TableCell className="text-center">0</TableCell>
                              <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p1TotalScore || 0)}</TableCell>
                              <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p2TotalScore || 0)}</TableCell>
                              <TableCell className="text-center">0</TableCell>
                              <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p2TotalScore || 0)}</TableCell>
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
