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
import GameOverOverlay from './game-end-overlay'

// const backend_url = "http://127.0.0.1:8080"
// const backend_url = "http://localhost:8080";
const backend_url = process.env.BACKEND_URL || "https://backend.ginrummys.ca";


function getRandomCards(cards: Card[]): Card[] {
  return [...cards].sort(() => 0.5 - Math.random()); // set random rards
  
}

export default function DealCards({ roomId, host, userName}: { roomId: string; host: string; userName: string}) {
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

  const [matchID, setMatchID] = useState<string>(roomId)

  const [whosTurn, setWhosTurn] = useState<string>("1")

  const [lastPickedCard, setLastPickedCard] = useState<Card | null>(null)
  const [currentRound, setCurrentRound] = useState<number>(1)

  
  const dropZoneRef = useRef<Card[]>([]); // 初始化 ref
  const hasHandlePass = useRef(false)

  const [open, setOpen] = useState(false); // 强制一直 open

  const [waitingNextRound, setWaitingNextRound] = useState<boolean>(false)

  const shuffledCards = getRandomCards(CARDS); 
  const initialCardsNumber = 24


  const hasHandledP1Play = useRef(false);

  // 放在组件顶部
  const hasHandledPass = useRef(false);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPassRef = useRef(currentPass);


  // 设置一开哪一方谁deal
  useEffect(() => {
    if (whosTurn === "1" && !hasHandledP1Play.current) {
      hasHandledP1Play.current = true;
      host === "1" ? (setP2Playing("toDeal")) : setP1Playing("toDeal");
    }
  }, [whosTurn, host]);
  
  // click deal，host start game
  async function startGame(){ 
    const initialCards: Card[] = [];
    const p1Cards: Card[] = [];
    const p2Cards: Card[] = [];

    let thisGameID = ''
    if (roomId != 'tutorial'){
      thisGameID = roomId
    }

    if (roomId == 'tutorial'){
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
        thisGameID = data['match_id']
        setMatchID(thisGameID)
      })
    }
    setMatchID(thisGameID)

    await fetch(`${backend_url}/api/match_start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: host,
        matchid: thisGameID,
        round:currentRound
      })
    })
    .then((response) => response.json()).then((data) => {
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

    await fetch(`${backend_url}/api/set_game_dealing_started`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchid: matchID })
    });

    setPlayer1Cards(GinRummyScore(p1Cards));
    setPlayer2Cards(GinRummyScore(p2Cards));
    setDealing(true);

    setP2Playing("passOrPick");
    setTimeout(() => {
      setCurrentPass(2); // ？
    }, 7400);
    setRemainingCards(shuffledCards.slice(initialCardsNumber));
  }

  // 非本轮host玩家监听 本轮host 是否点击了 Deal（轮询）
  useEffect(() => {
    if (host !== whosTurn && !dealing) {
      
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${backend_url}/api/is_game_dealing_started`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matchid: matchID }),
          });
          const data = await res.json();
          if (data.result === 0) {
            clearInterval(interval);
            fetchInitialCardsForGuest(); // 进入游戏状态
            await fetch(`${backend_url}/api/reset_game_dealing_started`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ matchid: matchID }),
            });

          }
        } catch (err) {
          console.error("Polling failed:", err);
        }
      }, 2000);

      return () => clearInterval(interval); // 清理 interval
    }
  }, [host, dealing]);

  // 非本轮host玩家一开始deal之后的牌
  async function fetchInitialCardsForGuest() {
    try {
      const response = await fetch(`${backend_url}/api/match_start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: host,
          matchid: matchID,
          round: currentRound
        })
      });
  
      const data = await response.json();
  
      const p1Cards: Card[] = [];
      const p2Cards: Card[] = [];
  
      const dropCard = {
        order: data["order0"],
        point: data["point0"],
        name: data["name0"],
        image: data["image0"],
        color: data["color0"],
        text: data["text0"]
      };
      
      setDropZoneCards([dropCard]);
  
      // 解析 Player1 和 Player2 的卡牌
      for (let i = 1; i <= 23; i += 2) {
        p2Cards.push({
          order: data[`order${i}`],
          point: data[`point${i}`],
          name: data[`name${i}`],
          image: data[`image${i}`],
          color: data[`color${i}`],
          text: data[`text${i}`]
        });
      }
  
      for (let i = 2; i <= 24; i += 2) {
        p1Cards.push({
          order: data[`order${i}`],
          point: data[`point${i}`],
          name: data[`name${i}`],
          image: data[`image${i}`],
          color: data[`color${i}`],
          text: data[`text${i}`]
        });
      }
  
      // 更新状态
      // setTimeout(() => {
      
        setPlayer1Cards(GinRummyScore(p1Cards));
        setPlayer2Cards(GinRummyScore(p2Cards));
        setDealing(true);
        setP1Playing("passOrPick");
      // }, 400);
  
    } catch (err) {
      console.error("fetchInitialCardsForGuest failed:", err);
    }
  }



// 每次 currentPass 更新时，更新 ref 值
useEffect(() => {
  currentPassRef.current = currentPass;
}, [currentPass]);

// 核心轮询逻辑：非 host 检测是否 passed
useEffect(() => {
 
  if (host !== whosTurn && dealing && currentPassRef.current === null && !hasHandledPass.current) {


    let count = 0; // 最大轮询次数限制（避免死循环）
    const MAX_ATTEMPTS = 200;

    const interval = setInterval(async () => {
      if (hasHandledPass.current) {
        clearInterval(interval);
        return;
      }

      if (count++ >= MAX_ATTEMPTS) {
        console.warn("⚠️ Polling timeout: No pass detected after max attempts.");
        clearInterval(interval);
        return;
      }

      try {
        const res = await fetch(`${backend_url}/api/is_passed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchid: matchID,round: currentRound })
        });

        const data = await res.json();

        if (data.result === 0) {
          // ✅ Host 点击了 PASS
          hasHandledPass.current = true;
          setP1Playing(null);
          setP2Playing("toTake");
          clearInterval(interval);
        } else if (data.result === 2) {
          // ✅ Host 从 DropZone 拿牌了（没点击 PASS）
          hasHandledPass.current = true;
          handleP1Play(); // 触发 host 自动出牌逻辑
          setP2Playing(null);
          clearInterval(interval);
        } else {
          // result = 1：尚未点击 pass，也未拿牌，继续轮询
        }

      } catch (err) {
        console.error("❌ Polling is_passed failed:", err);
      }
    }, 2000);

    // 清理 interval
    return () => {
      clearInterval(interval);
    };
  }
}, [dealing, host, matchID]);


  // 每次 dropZoneCards 更新，同步更新 ref
  useEffect(() => {
    dropZoneRef.current = dropZoneCards;
  }, [dropZoneCards]);

  
  function resetAll(){
    setDealing(false)
    setDropZoneCards([])
    setOpen(false)
    setWaitingNextRound(false); 
    hasHandledP1Play.current = false
    currentPassRef.current = null
    hasHandledPass.current = false
    setCurrentPass(null)

    const nextRound = currentRound + 1
    setCurrentRound(nextRound)
    
    if (whosTurn == host) {
      setP2Playing('toDeal')
      setP1Playing(null)
    } else {
      setP1Playing('toDeal')
      setP2Playing(null)
    }

  }


  async function get_card_from_stack(is_P2: boolean){
    //fetch a new card
    console.log('get_card_from_stack');
    
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
      if (is_P2){
        setP2Playing('toDrop');
        const updatedCards = [...player2Cards.cards, newCard]
        setPlayer2Cards(GinRummyScore(updatedCards));
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
      // setDropZoneCards([])
      setSendingNewCard(null)
     }
    }, [dealing]);

    // 点击Pass按钮，P1拿最开始的牌
    function handlePass(){
      setP2Playing(null);
      setP1Playing('toTake')
      
      if (roomId == 'tutorial'){
        //bug：hanldePass， robot从stack拿牌
        handleP1Play()//Changed to handleRobotAutoPlay() once
      } else {
        // TODO: 
        // getAnotherPlayerAction()
        fetch(`${backend_url}/api/set_passed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchid: matchID,round: currentRound })
        });

        if (host === whosTurn) {
          console.log("🎯 Host passed, now waiting for Guest's move");
          handleP1Play(); 
        
      }


    }
      
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
          console.log('handleDropZone');
          
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
          const newDropZoneCards = [...dropZoneCards];
          const lastCard = newDropZoneCards.pop();
          // setDropZoneCards(newDropZoneCards);

          
          if (lastCard) {
            setLastPickedCard(lastCard)
            setSendingNewCard('dropzone');
            setP2Playing('toDrop');
            setTimeout(() => {
              const updatedCards = [...player2Cards.cards, lastCard]
              setPlayer2Cards(GinRummyScore(updatedCards));
              // setDropZoneCards(dropZoneCards);
              setDropZoneCards(newDropZoneCards);

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

          if (lastPickedCard && item.card.name === lastPickedCard.name) {
            alert("⚠️ This card was just dropped! Please choose a different card.");
            return;
          }
          // dropZoneCards.push(item.card);
          // Qixuan Noted: Bug here
          // 这边直接push进去就行，这样set并不会将card放入dropzonecards
          // 你如果print出来就会发现实际上没加入dropzonecards
          // 如果P1从弃牌堆拿牌就会露馅
          // const updatedDropZoneCards = [...dropZoneCards, item.card];
          // setDropZoneCards(dropZoneCards);
          setDropZoneCards([...dropZoneCards, item.card]);

          const updatedCards = [...player2Cards.cards];
          updatedCards.splice(item.index, 1);
          setPlayer2Cards(GinRummyScore(updatedCards));
          console.log('handledrop');
          
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

          if (roomId == 'tutorial'){
            handleP1Play()
          } else {
            // TODO: 
            //getAnotherPlayerAction()
            handleP1Play()
          }
      }
    };
  
    // P1自动出牌
    async function handleP1Play() {// Changed to handleRobotAutoPlay once
      let ready = false;
      while (ready == false){
        console.log('handleP1Play1');
        
        await fetch(`${backend_url}/api/match_move`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            host: host,
            matchid: matchID,
            move: 'opponent_status'})
        }).then((response) => response.json())
        .then((data) => {
          ready = data["result"] == 0
        })
      }
      setP2Playing(null)

      let alreadyHandled = false;
      const interval = setInterval(async () => {
        if (alreadyHandled){
          clearInterval(interval);
        }
         
        
        try {
          console.log('handleP1Play2');
          const res = await fetch(`${backend_url}/api/match_move`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              host: host,
              matchid: matchID,
              move: 'wait_opponent'})
          })
          const data = await res.json();

            const place = data["operation"]
            // player dropped cards
            const dropped_card_str = data['dropped_card']
            const dropped_card_obj = JSON.parse(dropped_card_str);
            const dropped_card = { order:dropped_card_obj.order, point:dropped_card_obj.point, name:dropped_card_obj.name, image: dropped_card_obj.image, color: dropped_card_obj.color, text: dropped_card_obj.text }
            // card player get

            const new_card_str = data['new_card']
            const new_card_obj = JSON.parse(new_card_str);
            // const new_card = { order:data["new_card"]["order"], point: data["new_card"]["point"], name: data["new_card"]["name"], image: data["new_card"]["image"], color: data["new_card"]["color"], text: data["new_card"]["text"] }
            const new_card = { order:new_card_obj.order, point:new_card_obj.point, name:new_card_obj.name, image: new_card_obj.image, color: new_card_obj.color, text: new_card_obj.text }

            console.log('???????????????????????: ', place, dropped_card.name, new_card.name);

            if (!place || !dropped_card.name || !new_card.name) {
              return
            }

            if (place && dropped_card.name && new_card.name) {
              alreadyHandled = true
              clearInterval(interval)
            }

            

            if (place == 'knock') {
              handleKnockFromOpp()
            }
            else if (place == 'dropzone') {
              // if (dropZoneRef.current.length > 0) {
                const newDropZone = [...dropZoneRef.current];
                const lastCard = newDropZone.pop();
                // const lastCard = new_card;
                
                if (lastCard) {
                  setDropZoneCards(newDropZone); // ✅ 提前更新 DropZone 状态
                  setSendingNewCard('dropzone');
                  setP1Playing('toDrop');
              
                  // 👇 处理动画
                  handleP1PickAndDrop(dropped_card, lastCard);
              }
              
              // } else {
              //   alert('ERROR: No card in Drop Zone!');
              // }
            }
            
            else if (place == 'stack'){
                if (remainingCards.length > 0) {
                  //const [newCard, ...rest] = remainingCards;
                  // setNextCard(newCard);
                  //setRemainingCards(rest);
                  setSendingNewCard('stack');
                  setP1Playing('toDrop');

                  //handleP1Pick()
                  // const new_card = { order:data["order_pick"], point: data["point_pick"], name: data["name_pick"], image: data["image_pick"], color: data["color_pick"], text: data["text_pick"] }
                  
                  
                  //const updatedCards = [...player1Cards.cards, new_card]
                  //setPlayer1Cards(GinRummyScore(updatedCards));
                  
                  handleP1PickAndDrop(dropped_card, new_card)
                
                }
            }


        }catch (err) {
          alert(err);
        }
      }, 2000);
    }

    function handleP1PickAndDrop(dropCard: Card, newCard: Card) {
    
      // ✅ 1. 先显示拿牌动画（添加 newCard）
      const newHand = [...player1Cards.cards, newCard];
      setPlayer1Cards(GinRummyScore(newHand));
      setP1Playing('toDrop'); // 表明动画阶段是“刚拿完牌，准备出牌”
    
      // ✅ 2. 等拿牌动画结束后再开始出牌
      setTimeout(() => {
        const dropIndex = newHand.findIndex((card) => card.name === dropCard.name);
        if (dropIndex === -1) {
          console.warn("⚠️ Drop card not found after adding newCard:", dropCard.name);
          return;
        }
    
        const droppedCard = newHand[dropIndex];
        newHand.splice(dropIndex, 1);
    
        // ✅ 更新手牌和动画状态
        setPlayer1Cards(GinRummyScore(newHand));
        setP1DroppingCard({ ...droppedCard, index: dropIndex });
    
        // ✅ 3. 出牌动画后再更新 DropZone
        setTimeout(() => {
          setDropZoneCards((prev) => [...prev, droppedCard]);
          setP1Playing(null);
          setP1DroppingCard(null);
          setP2Playing('toTake');
        }, 500);
      }, 800); // 等待拿牌动画走完（和 transition.duration 配合）
    }
    
    async function handleKnockFromOpp() {
    
      // ✅ 修正：加上 const res = await fetch(...)
      const res = await fetch(`${backend_url}/api/get_latest_move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchid: matchID,
          round: currentRound
        }),
      });
    
      const data = await res.json();

      const myRounds = data.scoreSymmary.rounds.map((round:any) => ({
        ...round,
        p1Score: round.p2Score,
        p1Bonus: round.p2Bonus,
        p1Total: round.p2Total,
        p2Score: round.p1Score,
        p2Bonus: round.p1Bonus,
        p2Total: round.p1Total,
      }));
      
      const myScoreSummary = {
        p1TotalScore: data.scoreSymmary.p2TotalScore,
        p2TotalScore: data.scoreSymmary.p1TotalScore,
        rounds : myRounds
      }

      setScoreSummary(myScoreSummary);
      setWhosTurn(data.winner);
      setOpen(true);

      
    }

    async function handleKnockFromMe() {

      console.log('handleKnockFromMe');
      
      await fetch(`${backend_url}/api/match_move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: host,
          matchid: matchID,
          move: 'knock'})
      })

      const isHost = host === '1'; // 我是不是host
      // const isMeKnocking = true;  // 点击 Knock 的就是“我自己”
      

      const myCards = player2Cards // 自己手牌
      const opponentCards = player1Cards  // 对手手牌
      
      const myDeadwood = myCards.DeadwoodsPoint || 0;
      let adjustedOpponentDeadwood = opponentCards.DeadwoodsPoint || 0;
      const opponentDeadwood = opponentCards.DeadwoodsPoint || 0;
    
      const isGin = myDeadwood === 0;
      const isBigGin = isGin && myCards.cards.length === 11;

      if (!isGin && myCards.Melds && opponentCards.cards) {
        const layingOffResult = calculateLayingOffImproved(opponentCards.cards, myCards.Melds);
        adjustedOpponentDeadwood = layingOffResult.adjustedDeadwoodPoint;
        opponentCards.Deadwoods = layingOffResult.updatedDeadwoods;
        opponentCards.DeadwoodsPoint = layingOffResult.updatedDeadwoodsPoint;
        opponentCards.DeadwoodsDozenalPoint = layingOffResult.updatedDeadwoodsDozenalPoint;
      }
    
      let baseScore = 0;
      let bonus = 0;
      let result = "Knock";
    
      if (isGin) {
        baseScore = opponentDeadwood;
        bonus = isBigGin ? 39 : 30; // Dozenal: Big Gin = 39z, Gin = 30z
        result = isBigGin ? "Big Gin" : "Gin";
      } else if (myDeadwood < opponentDeadwood) {
        baseScore = opponentDeadwood - myDeadwood;
      } else {
        // Undercut 判定
        baseScore = myDeadwood - opponentDeadwood; // 差值
        bonus = 30;
        result = "Undercut";
      }
    
      // ✅ 判断谁得分
      let knockerScore = 0, knockerBonus = 0, opponentScore = 0, opponentBonus = 0;
      if (result === "Undercut") {
        opponentScore = baseScore;
        opponentBonus = bonus;
      } else {
        knockerScore = baseScore;
        knockerBonus = bonus;
      }
    
      // p1 是 host，p2 是 guest
      let p1Score = 0, p1Bonus = 0, p2Score = 0, p2Bonus = 0;

      if (result === "Undercut") {
        // 对手得分（这里你是 guest，那对手就是 p1）
        p1Score = baseScore;
        p1Bonus = bonus;
      } else {
        // 你自己得分
        p2Score = baseScore;
        p2Bonus = bonus;
      }
    
      const roundData = {
        round: (scoreSummary?.rounds?.length || 0) + 1,
        p1Score,
        p1Bonus,
        p1Total: p1Score + p1Bonus,
        p2Score,
        p2Bonus,
        p2Total: p2Score + p2Bonus,
        result,
      };
    
      const prevSummary: ScoreSummary = scoreSummary || { rounds: [], p1TotalScore: 0, p2TotalScore: 0 };
      const updatedRounds = [...prevSummary.rounds, roundData];
      const p1TotalScore = updatedRounds.reduce((acc, r) => acc + r.p1Total, 0);
      const p2TotalScore = updatedRounds.reduce((acc, r) => acc + r.p2Total, 0);
      
      const newScoreSummary: ScoreSummary = {
        rounds: updatedRounds,
        p1TotalScore,
        p2TotalScore,
      };
      
      // ✅ 更新状态
      setScoreSummary(newScoreSummary);

      let whosNext = ''
      if (result === "Undercut") {
        // 对手赢
        if (host == '0') {
          whosNext = '1'
          setWhosTurn('1')
        } else {
          whosNext = '0'
          setWhosTurn('0')
        }
      } else {
        // 自己赢
        if (host == '0') {
          whosNext ='0'
          setWhosTurn('0')
        } else {
          whosNext = '1'
          setWhosTurn('1')
        }
      }

      setWhosTurn(whosNext)

      const roundSummaryData = {
        matchid: matchID,
        scoreSymmary: newScoreSummary,
        winner: whosNext,
        round: currentRound
      };
      
      await fetch(`${backend_url}/api/submit_move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roundSummaryData),
      });
    
    }

    function calculateLayingOffImproved(opponentCards: Card[], knockerMelds: Card[]) {
      const cardsWithLayingOff = [...opponentCards, ...knockerMelds];
      const recalculated = GinRummyScore(cardsWithLayingOff);
    
      const knockerMeldPoint = knockerMelds.reduce((sum, c) => sum + c.point, 0);
      const effectiveLayingOff = (recalculated.MeldsPoint || 0) - knockerMeldPoint;
    
      const adjustedDeadwoodPoint = opponentCards.reduce((sum, c) => sum + c.point, 0) - effectiveLayingOff;
    
      return {
        adjustedDeadwoodPoint: Math.max(adjustedDeadwoodPoint, 0),
        updatedDeadwoods: recalculated.Deadwoods || [],
        updatedDeadwoodsPoint: recalculated.DeadwoodsPoint || 0,
        updatedDeadwoodsDozenalPoint: recalculated.DeadwoodsDozenalPoint || '0',
      };
    }
    

    // function performLayingOff(opponentDeadwoods: Card[], knockerMelds: Card[]) {
    //   const remainingDeadwoods: Card[] = [];
    //   const laidOffCards: Card[] = [];
    
    //   const getCardRank = (card: Card) => card.name.split('-')[1];
    //   const getCardSuit = (card: Card) => card.name.split('-')[0];
    //   const cardOrder = (card: Card) => card.order;
    
    //   opponentDeadwoods.forEach(card => {
    //     let isLaidOff = false;
    //     for (let i = 0; i < knockerMelds.length; i += 3) {
    //       const meld = knockerMelds.slice(i, i + 3);
    //       const isSet = meld.every(c => getCardRank(c) === getCardRank(meld[0]));
    //       const isRun = meld.every(c => getCardSuit(c) === getCardSuit(meld[0]));
    
    //       if (isSet) {
    //         // Set 搭牌：rank一致且suit不同
    //         if (getCardRank(card) === getCardRank(meld[0]) &&
    //             !meld.some(c => getCardSuit(c) === getCardSuit(card))) {
    //           isLaidOff = true;
    //           laidOffCards.push(card);
    //           break;
    //         }
    //       } else if (isRun) {
    //         // Run 搭牌：同花且顺子
    //         const orders = meld.map(cardOrder).sort((a, b) => a - b);
    //         const min = orders[0], max = orders[orders.length - 1];
    //         const orderVal = cardOrder(card);
    
    //         if (getCardSuit(card) === getCardSuit(meld[0]) &&
    //             (orderVal === min - 1 || orderVal === max + 1)) {
    //           isLaidOff = true;
    //           laidOffCards.push(card);
    //           break;
    //         }
    //       }
    //     }
    //     if (!isLaidOff) {
    //       remainingDeadwoods.push(card);
    //     }
    //   });
    
    //   const totalDeadwoodPoints = remainingDeadwoods.reduce((sum, c) => sum + c.point, 0);
    
    //   return {
    //     remainingDeadwoods,
    //     laidOffCards,
    //     totalDeadwoodPoints,
    //   };
    // }
    
    async function handlePlayNextRound(){
      setWaitingNextRound(true)

      // 接口传set waiting next round
      await fetch(`${backend_url}/api/set_waiting_next_round`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchid: matchID, host, round: currentRound }),
      });


      // 接口接收对方waiting next round也点击
      const intervalId = setInterval(async () => {
        const res = await fetch(`${backend_url}/api/is_both_waiting_next_round`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchid: matchID, round: currentRound }),
        });
        const data = await res.json();
        if (data.both_ready) {
          clearInterval(intervalId); // ✅ 停止轮询
          resetAll();               // ✅ 开始下一轮
        }
      }, 1000); // 每1秒轮询一次
      


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
        <AvatarDisplay image={'/main-image/avatar-robot.jpg'} player={1} name={roomId == 'tutorial' ? 'Robot' : 'Opponent'} p2Playing={p2Playing} p1Playing={p1Playing} currentPass={currentPass}/>

        <div className="relative flex items-center justify-center w-full h-[500px] gap-4">
            {/* Player1 */}
            {dealing &&
                player1Cards.cards.map((card, index) => (
                  <motion.div
                  key={`player1-${index}`}
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
                        {/* <DraggableCard
                          key={index}
                          index={index??10}
                          card={card}
                          moveCard={(from, to,wholeCardList) => moveCard(from, to,wholeCardList)}
                          p2Playing ={p2Playing}
                          wholeCardList = {player2Cards.cards}
                      /> */}
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
      {/* {whosTurn} */}
                {!dealing && whosTurn == host ? (
                    <Button
                    className="absolute left-full ml-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                    onClick={startGame}
                    >
                    Deal
                    </Button>
                ) : (dealing && whosTurn == host && currentPass ? (
                    <Button
                    className="absolute left-full ml-4 px-4 py-2 w-[100px] bg-blue-500 text-white rounded"
                    onClick={handlePass}
                    >
                    Pass
                    </Button>
                ) : (
                  // 占位用的空盒子（保持布局）
                  <div style={{ width: "0px", height: "40px" }} />
                ))}

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


          <AvatarDisplay image={'/main-image/avatar-user.jpg'} player={2} name={userName}  p2Playing={p2Playing} p1Playing={p1Playing} currentPass={currentPass}/>

          {p2Playing == 'passOrPick' && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={'PICK OR PASS'}  bgColor={'bg-yellow-200'} />
              
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
          {p2Playing == 'toDeal' && (
            <div
              className="absolute ml-4 p-4"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 'calc(50% + 60px)',
              }}
            >
                <ChatBubble content={ 'CLICK DEAL'}  bgColor={'bg-yellow-200'} />
            </div>
          )}

          {dealing &&(
            <Dialog open={open} onOpenChange={(v) => setOpen(true)}>
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
                      onClick={() => handleKnockFromMe()}
                    >
                      KNOCK
                  </div>
              </DialogTrigger>
{!waitingNextRound ? (
              <DialogContent >
                <DialogHeader>
                  <DialogTitle className="flex flex-col items-center justify-center">
                    {whosTurn == host ? "You Win this round 😊 " : "You Loss this round 😢"}
                  </DialogTitle>
                  {/* <DialogDescription className="flex flex-col items-center justify-center"> Round end by knocking! </DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Table>
                    <TableHeader className="bg-gray-200">
                      <TableRow>
                        <TableCell className="font-bold text-center"></TableCell>
                        <TableCell colSpan={3} className="font-bold text-center">
                          {roomId === 'tutorial' ? 'Robot' : 'Opponent'}
                        </TableCell>
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
                                <TableCell className="text-center">{round.round }</TableCell>
                                <TableCell className="text-center">{decimalToDozenal(round.p1Score || 0)}</TableCell>
                                <TableCell className="text-center">{decimalToDozenal(round.p1Bonus || 0)}</TableCell>
                                <TableCell className="text-center">{decimalToDozenal(round.p1Total || 0)}</TableCell>
                                <TableCell className="text-center">{decimalToDozenal(round.p2Score || 0)}</TableCell>
                                <TableCell className="text-center">{decimalToDozenal(round.p2Bonus || 0)}</TableCell>
                                <TableCell className="text-center">{decimalToDozenal(round.p2Total || 0)}</TableCell>
                                <TableCell className="text-center">{round.result}</TableCell>
                              </TableRow>
                            ))}
                            {/* 总分行 */}
                          {/* TODO: 这里之后要改，存的时候就存dozenal的 */}
                            <TableRow>
                              <TableCell className="font-semibold text-center">Total Score</TableCell>
                              {/* <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p1TotalScore || 0) }</TableCell> */}
                              <TableCell className="text-center"></TableCell>
                              <TableCell className="text-center"></TableCell>
                              <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p1TotalScore || 0)}</TableCell>
                              {/* <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p2TotalScore || 0)}</TableCell> */}
                              <TableCell className="text-center"></TableCell>
                              <TableCell className="text-center"></TableCell>
                              <TableCell className="text-center">{decimalToDozenal(scoreSummary?.p2TotalScore || 0)}</TableCell>
                              <TableCell className="text-center"></TableCell>
                            </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handlePlayNextRound}>Play next round</Button>
               
                </DialogFooter>
                </DialogContent>
          ) : (
            <DialogContent className="text-center p-6 space-y-4 rounded-2xl shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                  ⏳ Waiting...
                </DialogTitle>
              </DialogHeader>

              <div className="flex justify-center items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>

              <p className="text-muted-foreground text-m">
                Please wait while your opponent gets ready.
              </p>

              <DialogFooter>
                {/* <Button
                  type="submit"
                  onClick={resetAll}
                  className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium px-6 py-2 rounded-lg shadow-md"
                >
                  Start
                </Button> */}
              </DialogFooter>
            </DialogContent>


          )}
            </Dialog>
          )}
        </div>
      </div>


      {scoreSummary && (scoreSummary.p1TotalScore >= 120 || scoreSummary.p2TotalScore >= 120) && (
        <GameOverOverlay
          isWin={(() => {
            const isHost = host === whosTurn;
            return (isHost && scoreSummary.p1TotalScore >= 120) || (!isHost && scoreSummary.p2TotalScore >= 120);
          })()}
          p1TotalScore={scoreSummary.p1TotalScore}
          p2TotalScore={scoreSummary.p2TotalScore}
        />
      )}
    </DndProvider>
    

  )
}
