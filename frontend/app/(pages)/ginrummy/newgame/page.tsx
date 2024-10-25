"use client"

import { Button } from "@/components/ui/button"
import { useState } from 'react';


import SortableCardList from "@my-components/lib/sortable-card-list"

import Link from "next/link"
import Image from 'next/image';

import { HeaderBar } from "@/lib/my-components/lib/header-bar"


export default function GamePage() {

    // TODO: 这里应该换成后端传来的东西了
    const my_cards_list = ['hearts-07','hearts-Q','hearts-03','hearts-08','hearts-K','hearts-09','hearts-10','hearts-J','hearts-0A','hearts-C']

    const [dealClicked, setDealClicked] = useState(false)

    return(
        <div className='h-full w-full flex flex-col '>
            <HeaderBar></HeaderBar>
            <div className="flex felx-row items-center justify-center w-full h-[600px] py-6 gap-4 px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                    <Image  src={'/main-image/my-avatar.jpg'} 
                                alt={'My Avatar'} 
                                width={100} 
                                height={100} 
                                className="object-contain"
                                style={{ borderRadius: '50%' }}/>
                    {dealClicked? (
                            <SortableCardList display_cards_list={my_cards_list}/>
                            ) : (
                            <div className="h-[150px]"></div>
                        )
                    }
                    <div className="flex flex-row gap-6 items-center justify-center text-center">
                        <Image src={'/cards-image/back.svg.png'} 
                               alt="Card back"
                               width={100} 
                               height={150}
                               className="object-contain"/>
                        {!dealClicked? (
                            <Button className="w-[100px]" onClick={() => setDealClicked(true)}>Deal</Button>
                            ) : (
                                <Button className="w-[100px]" onClick={() => {}}>Pass</Button>
                        )
                    }
                    </div>
                    {dealClicked? (
                            <SortableCardList display_cards_list={my_cards_list}/>
                            ) : (
                            <div className="h-[150px]"></div>
                        )
                    }
                    
                    <Image  src={'/main-image/my-avatar-1.jpg'} 
                            alt={'My Avatar'} 
                            width={100} 
                            height={100} 
                            className="object-contain"
                            style={{ borderRadius: '50%' }}/>
                </div>
                {/* <div className="bg-gray-100 w-[100px] h-full">
                    dfsd
                 </div>  */}
            </div>
            
        </div>
        
    )
}