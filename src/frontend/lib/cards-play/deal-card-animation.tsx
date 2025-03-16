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
import { start } from 'repl';
import { drop } from 'lodash';

//const backend_url = process.env.BACKEND_URL || "https://backend.ginrummys.ca";
const backend_url = "http://localhost:8080";

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

  const [matchID, setMatchID] = useState<string | null>(null)

  // get random stack of cards (shuffle the card)
  const shuffledCards = getRandomCards(CARDS); 
  const initialCardsNumber = 24
  const host = 1

  function resetAll(){
    setDealing(false)
  }

  async function startGame(){ 
    const initialCards: Card[] = [];
    const p1Cards: Card[] = [];
    const p2Cards: Card[] = [];

    await fetch(`${backend_url}/api/match_create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bot: 'True'
      })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('startGame', data)
      setMatchID(data['match_id'])
    })
    await fetch(`${backend_url}/api/match_start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: host,
        matchid: matchID
      })
    }).then((response) => response.json()).then((data) => {
      setDropZoneCards([{ order:data["order0"], point: data["point0"], name: data["name0"], image: data["image0"], color: data["color0"], text: data["text0"] }])
        p1Cards.push({ order:data["order1"], point: data["point1"], name: data["name1"], image: data["image1"], color: data["color1"], text: data["text1"] })
        p2Cards.push({ order:data["order2"], point: data["point2"], name: data["name2"], image: data["image2"], color: data["color2"], text: data["text2"] })
        p1Cards.push({ order:data["order3"], point: data["point3"], name: data["name3"], image: data["image3"], color: data["color3"], text: data["text3"] })
        p2Cards.push({ order:data["order4"], point: data["point4"], name: data["name4"], image: data["image4"], color: data["color4"], text: data["text4"] })
        p1Cards.push({ order:data["order5"], point: data["point5"], name: data["name5"], image: data["image5"], color: data["color5"], text: data["text5"] })
        p2Cards.push({ order:data["order6"], point: data["point6"], name: data["name6"], image: data["image6"], color: data["color6"], text: data["text6"] })
        p1Cards.push({ order:data["order7"], point: data["point7"], name: data["name7"], image: data["image7"], color: data["color7"], text: data["text7"] })
        p2Cards.push({ order:data["order8"], point: data["point8"], name: data["name8"], image: data["image8"], color: data["color8"], text: data["text8"] })
        p1Cards.push({ order:data["order9"], point: data["point9"], name: data["name9"], image: data["image9"], color: data["color9"], text: data["text9"] })
        p2Cards.push({ order:data["order10"], point: data["point10"], name: data["name10"], image: data["image10"], color: data["color10"], text: data["text10"] })
        p1Cards.push({ order:data["order11"], point: data["point11"], name: data["name11"], image: data["image11"], color: data["color11"], text: data["text11"] })
        p2Cards.push({ order:data["order12"], point: data["point12"], name: data["name12"], image: data["image12"], color: data["color12"], text: data["text12"] })
        p1Cards.push({ order:data["order13"], point: data["point13"], name: data["name13"], image: data["image13"], color: data["color13"], text: data["text13"] })
        p2Cards.push({ order:data["order14"], point: data["point14"], name: data["name14"], image: data["image14"], color: data["color14"], text: data["text14"] })
        p1Cards.push({ order:data["order15"], point: data["point15"], name: data["name15"], image: data["image15"], color: data["color15"], text: data["text15"] })
        p2Cards.push({ order:data["order16"], point: data["point16"], name: data["name16"], image: data["image16"], color: data["color16"], text: data["text16"] })
        p1Cards.push({ order:data["order17"], point: data["point17"], name: data["name17"], image: data["image17"], color: data["color17"], text: data["text17"] })
        p2Cards.push({ order:data["order18"], point: data["point18"], name: data["name18"], image: data["image18"], color: data["color18"], text: data["text18"] })
        p1Cards.push({ order:data["order19"], point: data["point19"], name: data["name19"], image: data["image19"], color: data["color19"], text: data["text19"] })
        p2Cards.push({ order:data["order20"], point: data["point20"], name: data["name20"], image: data["image20"], color: data["color20"], text: data["text20"] })
        p1Cards.push({ order:data["order21"], point: data["point21"], name: data["name21"], image: data["image21"], color: data["color21"], text: data["text21"] })
        p2Cards.push({ order:data["order22"], point: data["point22"], name: data["name22"], image: data["image22"], color: data["color22"], text: data["text22"] })
        p1Cards.push({ order:data["order23"], point: data["point23"], name: data["name23"], image: data["image23"], color: data["color23"], text: data["text23"] })
        p2Cards.push({ order:data["order24"], point: data["point24"], name: data["name24"], image: data["image24"], color: data["color24"], text: data["text24"] })
    })

    setPlayer1Cards(GinRummyScore(p1Cards));
    setPlayer2Cards(GinRummyScore(p2Cards));
    setDealing(true);
  }


  async function get_card_from_stack(is_P2: boolean){
    //fetch a new card
    await fetch(`${backend_url}/api/match_move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: host,
        matchid: matchID,
        move: 'stack'})
    })
    .then((response) => response.json())
    .then((data) => {
      const newCard = { order:data["order"], point: data["point"], name: data["name"], image: data["image"], color: data["color"], text: data["text"] };
      setSendingNewCard('stack'); 
      console.log('get_card_from_stack, newCard', newCard)
      if (is_P2){
        setP2Playing('toDrop');
        console.log('get_card_from_stack, P2 to drop')
        const updatedCards = [...player2Cards.cards, newCard]
        setPlayer2Cards(GinRummyScore(updatedCards));
        console.log('get_card_from_stack, P2 to drop', updatedCards)
        console.log('get_card_from_stack, P2 to drop', player2Cards.cards)
      }
    }
  )
  }

  useEffect(() => {
    if (dealing) {
      // The following functionality is transferred to the backend
      // deal card to each player
      
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
      handleP1Play()
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
    async function handleNext(){
      switch (p2Playing) {
        case 'toDrop':
          alert('You need to drop a card');
          break;
        case 'toTake':
          if (remainingCards.length > 0) {
            //const [newCard, ...rest] = remainingCards;
            //setRemainingCards(rest);
            await get_card_from_stack(true)
            
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
    async function handleDropZone(){
      if (p2Playing == 'toTake' || currentPass == 2){
        if (currentPass == 2) {
          setCurrentPass(null)
        }
        if (dropZoneCards && dropZoneCards.length > 0) {
          await fetch(`${backend_url}/api/match_move`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              host: host,
              matchid: matchID,
              move: 'dropzone'})
          })
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
    async function handleDrop(item: { card: Card; index: number }){
      switch (p2Playing) {
        case 'toTake':
          alert('need to pick a card first');
          break;
        case 'toDrop':
          dropZoneCards.push(item.card);
          // Qixuan Noted: Bug here
          // 这边直接push进去就行，这样set并不会将card放入dropzonecards
          // 你如果print出来就会发现实际上没加入dropzonecards
          // 如果P1从弃牌堆拿牌就会露馅
          //const updatedDropZoneCards = [...dropZoneCards, item.card];
          //setDropZoneCards(updatedDropZoneCards);
          //console.log("dropzoneafterdrop", dropZoneCards)
          const updatedCards = [...player2Cards.cards];
          updatedCards.splice(item.index, 1);
          setPlayer2Cards(GinRummyScore(updatedCards));
          await fetch(`${backend_url}/api/match_move`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              host: host,
              matchid: matchID,
              move: 'drop',
              dropped_card_name: item.card.name})
          })
          setP1Playing("toTake")
          setP2Playing(null)
          handleP1Play()
      }
    };
  
    // P1自动出牌
    async function handleP1Play() {
      await fetch(`${backend_url}/api/match_move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: host,
          matchid: matchID,
          move: 'wait_opponent'})
      }).then((response) => response.json())
      .then((data) => {
        console.log('P1Play', data)
        const place = data["operation"]
        const dropped_card = { order:data["order"], point: data["point"], name: data["name"], image: data["image"], color: data["color"], text: data["text"] }
        if (place == 'dropzone') {
          if (dropZoneCards.length > 0) {
            const lastCard = dropZoneCards.pop()
            if (lastCard) {
              setDropZoneCards(dropZoneCards);
              setSendingNewCard('dropzone');
              setP1Playing('toDrop');
              handleP1PickAndDrop(dropped_card, lastCard)
            }
          }
          else {
            alert('ERROR: No card in Drop Zone!');
          }
        } else if (place == 'stack'){
            if (remainingCards.length > 0) {
              //const [newCard, ...rest] = remainingCards;
              // setNextCard(newCard);
              //setRemainingCards(rest);
              setSendingNewCard('stack');
              setP1Playing('toTake');
              //handleP1Pick()
              const new_card = { order:data["order_pick"], point: data["point_pick"], name: data["name_pick"], image: data["image_pick"], color: data["color_pick"], text: data["text_pick"] }
              
              //console.log('get_card_from_stack, P1 to drop')
              //const updatedCards = [...player1Cards.cards, new_card]
              //setPlayer1Cards(GinRummyScore(updatedCards));
              //console.log('get_card_from_stack, P1 to drop', updatedCards)
              //console.log('get_card_from_stack, P1 to drop', player1Cards.cards)
              handleP1PickAndDrop(dropped_card, new_card)
            }
        }
      })
    }

    function handleP1PickAndDrop(dropCard: Card, newCard: Card){
      setTimeout(() => {
        console.log('P1Pick')
        //const updatedCards = [...player1Cards.cards, newCard]
        //setPlayer1Cards(GinRummyScore(updatedCards));
        player1Cards.cards.push(newCard)
        setP1Playing('toDrop');

        // mock P1 出牌
        setTimeout(() => {
          let dropIndex = 1;
          if (player1Cards.cards.length > 0) {
            for (let i = 0; i < player1Cards.cards.length; i++) {
              if (player1Cards.cards[i].name == dropCard.name) {
                dropIndex = i
                break;
              }
            }
            
            const droppedCard = player1Cards.cards[dropIndex];
            setP1DroppingCard({...droppedCard, index:dropIndex});
            player1Cards.cards.splice(dropIndex, 1);
            setPlayer1Cards(GinRummyScore(player1Cards.cards));
            console.log(droppedCard)
            //console.log('P1Drop', player1Cards.cards)
  
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
                    initial={{ x: p1DroppingCard.index? -100 * (p1DroppingCard.index-5) : -100, y: -150, opacity: 1, zIndex:100 }} 
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
                    onClick={startGame}
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
