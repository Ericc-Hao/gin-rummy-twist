"use client"

// import { useSelector, useDispatch } from 'react-redux';
// // import {  setUserInfo } from '@shared-store/slices/user';
// import { AppDispatch, RootState } from '@shared-store/index'; 
// import { useEffect } from 'react';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from 'next/image';

import { HeaderBar } from '@/lib/my-components/header-bar';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog"; 
  import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; 



export default function homePage() {

    // 不要删
    // const dispatch = useDispatch<AppDispatch>();
    // const user = useSelector((state: RootState) => state.user);
    // useEffect(() => {
    //     console.log("Updated user info: ", user);
    // }, [user]);

    return(
        <div className='h-full w-full '>
            <HeaderBar></HeaderBar>
            <div className='flex felx-col items-center justify-center w-full flex-1 pt-[100px]'>
                <div className="group relative flex flex-col w-[90%] h-[500px]  rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                    <div className="flex h-full w-full">
                        <Image  src="/main-image/home-4.jpg"
                                alt="home-1"
                                layout="fill"
                                objectFit="cover"
                                style={{ borderRadius: '4px', zIndex:-1 }}
                            />
                    </div>

                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className="w-full transition-transform duration-300 font-black z-100">PLAY</Button>
                        </DrawerTrigger>
                        <DrawerContent className="m-4 w-full h-auto flex items-center justify-center">
                            <VisuallyHidden>
                                <DialogTitle>Game Options</DialogTitle>
                                <DialogDescription>Choose your game mode and start playing!</DialogDescription>
                            </VisuallyHidden>
                            <div className='flex flex-col w-[300px] gap-4 m-4 '>
                                {StartButton("/ginrummy/newgame", "Start a New Game")}
                                {StartButton("", "Continue a Game")}
                                {StartButton("", "Start a Tutorial")}
                                {StartButton("/ginrummy/pvp", "Play with a Friend")}
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </div>    
    )
}

function StartButton(href: string, name: string) {
    return (
      <Button asChild className="w-full">
        <Link
          href={href}
          className="w-full text-center transition-transform duration-300 hover:opacity-75" 
        >
          {name}
        </Link>
      </Button>
    );
  }

